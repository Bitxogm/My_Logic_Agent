import api from './api';
import { ChatRequest, ChatResponse, ChatSession } from '../types/chat';

export const chatService = {
  // Enviar mensaje al chatbot
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post('/chatbot/', request);
    return response.data;
  },

  // Obtener historial de chat
  getHistory: async (sessionId: string): Promise<ChatSession> => {
    const response = await api.get(`/chatbot/history/${sessionId}`);
    return response.data;
  },

  // Limpiar sesión de chat
  clearSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/chatbot/session/${sessionId}`);
  }
};