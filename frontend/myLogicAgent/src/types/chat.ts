export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  context?: string;
  createdAt: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
  sessionId: string;
  messageCount: number;
}

export interface ChatSessionSummary {
  sessionId: string;
  title: string;
  lastActivity: string;
  createdAt: string;
}

export interface ChatHistoryResponse {
  sessions: ChatSessionSummary[];
}