import api from './api';
import { LogicRequest, LogicResponse, DiagramRequest, DiagramResponse } from '../types/agent';

export const agentService = {
  // Resolver ejercicio lógico
  solveLogic: async (request: LogicRequest): Promise<LogicResponse> => {
    const response = await api.post('/api/agent/solve', request);
    return response.data;
  },

  // Generar diagrama
  generateDiagram: async (request: DiagramRequest): Promise<DiagramResponse> => {
    const response = await api.post('/api/logic/diagram', request);
    return response.data;
  }
};