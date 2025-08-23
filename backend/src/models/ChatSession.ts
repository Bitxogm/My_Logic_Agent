import { Schema, model, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  sessionId: string;
  title: string; 
  messages: IChatMessage[];
  context?: string;
  lastActivity: Date; 
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
  title: { type: String, required: true }, 
  messages: [ChatMessageSchema],
  context: { type: String },
  lastActivity: { type: Date, default: Date.now }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model<IChatSession>('ChatSession', ChatSessionSchema);