import { ChatMessage as ChatMessageType } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';
  
  return (
    <div className={cn(
      "flex gap-3 max-w-[85%] animate-chat-in",
      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={cn(
          "text-xs font-medium",
          isUser ? "bg-gradient-chat text-white" : "bg-muted text-muted-foreground"
        )}>
          {isUser ? <User size={14} /> : <Bot size={14} />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "rounded-2xl px-4 py-3 shadow-chat transition-chat",
        isUser 
          ? "bg-gradient-chat text-white rounded-tr-md" 
          : "bg-card text-card-foreground rounded-tl-md border"
      )}>
        {message.image && (
          <img 
            src={message.image} 
            alt="Shared image" 
            className="rounded-lg mb-2 max-w-full h-auto"
          />
        )}
        
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="animate-pulse-soft">Analyzing...</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </span>
          ) : (
            message.content
          )}
        </p>
        
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-white/70" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}