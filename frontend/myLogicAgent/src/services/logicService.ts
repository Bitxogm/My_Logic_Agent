// frontend/src/services/logicService.ts

import api from './api';
import type { LogicResponse } from '../types/agent';

export interface LogicHistoryEntry extends LogicResponse {
  _id: string;
  modo: 'statement' | 'diagram' | 'code';
  enunciado: string;
  opciones?: string[];
  timestamp: string;
}

export interface LogicHistoryResponse {
  history: LogicHistoryEntry[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface LogicHistoryParams {
  page?: number;
  limit?: number;
}

export const logicService = {
  // Obtener historial de consultas lógicas
  getHistory: async (params: LogicHistoryParams = {}): Promise<LogicHistoryResponse> => {
    const response = await api.get('/api/agent/history', { params });
    return response.data;
  },

  // Eliminar entrada del historial
  deleteEntry: async (id: string): Promise<void> => {
    await api.delete(`/api/agent/history/${id}`);
  }
};