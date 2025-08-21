import { Schema, model, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  sessionId: string;
  messages: IChatMessage[];
  context?: string; // Contexto del ejercicio si aplica
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatSessionSchema = new Schema<IChatSession>({
  sessionId: { type: String, required: true, unique: true },
  messages: [ChatMessageSchema],
  context: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model<IChatSession>('ChatSession', ChatSessionSchema);