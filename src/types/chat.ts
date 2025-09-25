export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  image?: string;
  isProcessing?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isProcessing: boolean;
  modelStatus: 'downloading' | 'ready' | 'error';
}