import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { SettingsPanel } from "./SettingsPanel";
import { ChatMessage as ChatMessageType } from "@/types/chat";
import { Camera } from "@capacitor/camera";
import { CameraResultType, CameraSource } from "@capacitor/camera";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Settings } from "lucide-react";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "welcome",
      content: "Welcome to MobileGPT! I can analyze images, answer questions, and help you with various tasks - all running locally on your device. How can I assist you today?",
      type: "ai",
      timestamp: new Date(),
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOnline] = useState(false); // Simulating offline mode
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, image?: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      type: "user",
      timestamp: new Date(),
      image,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Add processing message
    const processingMessage: ChatMessageType = {
      id: `processing-${Date.now()}`,
      content: "Processing your request with AI...",
      type: "ai",
      timestamp: new Date(),
      isProcessing: true,
    };

    setMessages(prev => [...prev, processingMessage]);

    try {
      // Call Gemini API through secure edge function
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          messages: [{ content, type: 'user' }],
          image: image
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to get AI response');
      }

      const aiResponse = data?.response || "I apologize, but I couldn't process your request at the moment. Please try again.";

      setMessages(prev => 
        prev.map(msg => 
          msg.id === processingMessage.id 
            ? {
                ...msg,
                content: aiResponse,
                isProcessing: false,
              }
            : msg
        )
      );

    } catch (error) {
      console.error('AI Processing Error:', error);
      
      // Show error message to user
      setMessages(prev => 
        prev.map(msg => 
          msg.id === processingMessage.id 
            ? {
                ...msg,
                content: `I encountered an error processing your request. ${isOnline ? 'Please try again.' : 'The offline AI model will be available soon.'}`,
                isProcessing: false,
              }
            : msg
        )
      );

      toast({
        title: "AI Processing Error",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraClick = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // Let user choose camera or gallery
      });

      if (image.dataUrl) {
        handleSendMessage("I'd like you to analyze this image.", image.dataUrl);
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-lg border-b p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-lg">MobileGPT</h1>
            <p className="text-sm text-muted-foreground">Offline AI Assistant</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="w-8 h-8"
            >
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-6">
        <div className="space-y-6 max-w-2xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onCameraClick={handleCameraClick}
        isProcessing={isProcessing}
      />

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}