// frontend/src/services/diagramService.ts

import api from './api';

export interface DiagramHistoryEntry {
  _id: string;
  enunciado: string;
  mermaid: string;
  timestamp: string;
}

export interface DiagramHistoryResponse {
  history: DiagramHistoryEntry[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface DiagramHistoryParams {
  page?: number;
  limit?: number;
}

export const diagramService = {
  // Obtener historial de diagramas
  getHistory: async (params: DiagramHistoryParams = {}): Promise<DiagramHistoryResponse> => {
    const response = await api.get('/api/logic/history', { params });
    return response.data;
  },

  // Eliminar entrada del historial
  deleteEntry: async (id: string): Promise<void> => {
    await api.delete(`/api/logic/history/${id}`);
  }
};