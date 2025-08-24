// Reemplazar el archivo completo
import api from './api';
import type { 
  Exercise, 
  CreateExerciseRequest, 
  UpdateExerciseRequest,
  ExerciseSearchParams,
  ExerciseSearchResponse,
  ExerciseStats
} from '../types/exercise';

export const exerciseService = {
  // Obtener todos los ejercicios
  getAll: async (): Promise<Exercise[]> => {
    const response = await api.get('/api/exercises');
    return response.data;
  },

  // Obtener ejercicio por ID
  getById: async (id: string): Promise<Exercise> => {
    const response = await api.get(`/api/exercises/${id}`);
    return response.data;
  },

  // Crear nuevo ejercicio
  create: async (exercise: CreateExerciseRequest): Promise<Exercise> => {
    const response = await api.post('/api/exercises', exercise);
    return response.data;
  },

  // Actualizar ejercicio
  update: async (id: string, exercise: UpdateExerciseRequest): Promise<Exercise> => {
    const response = await api.put(`/api/exercises/${id}`, exercise);
    return response.data;
  },

  // Eliminar ejercicio
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/exercises/${id}`);
  },

  // Búsqueda avanzada
  search: async (params: ExerciseSearchParams): Promise<ExerciseSearchResponse> => {
    const response = await api.get('/api/exercises/search', { params });
    return response.data;
  },

  // Obtener estadísticas
  getStats: async (): Promise<ExerciseStats> => {
    const response = await api.get('/api/exercises/stats');
    return response.data;
  }
};