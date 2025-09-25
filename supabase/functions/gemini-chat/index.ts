import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { messages, image } = await req.json();
    
    console.log('Processing chat request with', messages?.length || 0, 'messages', image ? 'with image' : 'without image');

    // Prepare the request body for Gemini API
    const parts = [];
    
    // Add text content
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      parts.push({ text: lastMessage.content });
    }
    
    // Add image if provided
    if (image) {
      // Extract base64 data from data URL
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      });
    }

    const requestBody = {
      contents: [{
        parts: parts
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received successfully');

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini');
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ 
      response: generatedText,
      model: 'gemini-1.5-flash'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error',
      details: 'Check function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});