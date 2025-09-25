import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string, image?: string) => void;
  onCameraClick: () => void;
  isProcessing: boolean;
}

export function ChatInput({ onSendMessage, onCameraClick, isProcessing }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onCameraClick}
          disabled={isProcessing}
          className="shrink-0 w-10 h-10 rounded-full transition-fab hover:shadow-fab"
        >
          <Camera size={18} />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask MobileGPT anything..."
            disabled={isProcessing}
            className="pr-12 rounded-full border-muted bg-muted/50 focus:bg-background transition-colors"
          />
          
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isProcessing}
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full transition-fab",
              "bg-gradient-chat hover:shadow-fab disabled:opacity-50"
            )}
          >
            <Send size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}