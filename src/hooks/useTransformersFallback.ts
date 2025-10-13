// Fallback implementation using Transformers.js for broader compatibility
import { useState, useEffect, useCallback } from 'react';

let TransformersModule: any = null;

export type FallbackModelStatus = 'loading' | 'downloading' | 'ready' | 'error';

interface TransformersFallbackReturn {
  generate: (prompt: string, image?: string) => Promise<string>;
  modelStatus: FallbackModelStatus;
  downloadProgress: number;
  error: string | null;
  initializeModel: () => Promise<void>;
}

export function useTransformersFallback(): TransformersFallbackReturn {
  const [modelStatus, setModelStatus] = useState<FallbackModelStatus>('loading');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<any>(null);

  // Dynamic import of transformers.js
  const loadTransformers = useCallback(async () => {
    try {
      if (!TransformersModule) {
        // @ts-ignore - Dynamic import
        const { pipeline, env } = await import('@huggingface/transformers');
        
        // Configure transformers.js for local usage
        env.allowLocalModels = true;
        env.allowRemoteModels = true;
        
        TransformersModule = { pipeline };
      }
      return TransformersModule;
    } catch (err) {
      console.error('Failed to load transformers.js:', err);
      throw new Error('Failed to load AI engine');
    }
  }, []);

  // Initialize the model
  const initializeModel = useCallback(async () => {
    try {
      setModelStatus('loading');
      setError(null);

      console.log('Loading transformers.js...');
      const transformers = await loadTransformers();

      setModelStatus('downloading');
      setDownloadProgress(0);

      // Use a lightweight text generation model
      const textGenerator = await transformers.pipeline(
        'text-generation', 
        'Xenova/LaMini-Flan-T5-248M',
        {
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              const percent = Math.round((progress.loaded / progress.total) * 100);
              setDownloadProgress(percent);
            }
          }
        }
      );

      setPipeline(textGenerator);
      setModelStatus('ready');
      setDownloadProgress(100);
      console.log('Transformers.js model loaded successfully');

    } catch (err) {
      console.error('Model initialization failed:', err);
      setModelStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to initialize AI model');
    }
  }, [loadTransformers]);

  // Generate text
  const generate = useCallback(async (prompt: string, image?: string): Promise<string> => {
    if (!pipeline) {
      throw new Error('AI model is not ready. Please wait for initialization to complete.');
    }

    if (image) {
      console.warn('Image analysis not supported in fallback mode. Processing text only.');
    }

    try {
      // Format prompt for better responses
      const formattedPrompt = `Human: ${prompt}\n\nAssistant:`;
      
      const result = await pipeline(formattedPrompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        do_sample: true,
        pad_token_id: 0,
      });

      if (result && result[0] && result[0].generated_text) {
        // Extract only the assistant's response
        let response = result[0].generated_text;
        const assistantIndex = response.indexOf('Assistant:');
        if (assistantIndex !== -1) {
          response = response.substring(assistantIndex + 10).trim();
        }
        
        // Clean up the response
        response = response.replace(/Human:.*$/s, '').trim();
        return response || 'I apologize, but I was unable to generate a proper response. Please try rephrasing your question.';
      }

      return 'I apologize, but I encountered an issue generating a response. Please try again.';

    } catch (err) {
      console.error('Generation error:', err);
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }, [pipeline]);

  // Auto-initialize on mount
  useEffect(() => {
    initializeModel();
  }, [initializeModel]);

  return {
    generate,
    modelStatus,
    downloadProgress,
    error,
    initializeModel
  };
}