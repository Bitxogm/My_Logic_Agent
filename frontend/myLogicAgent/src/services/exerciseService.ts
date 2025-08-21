import api from './api';
import { Exercise, CreateExerciseRequest } from '../types/exercise';

export const exerciseService = {
  // Obtener todos los ejercicios
  getAll: async (): Promise<Exercise[]> => {
    const response = await api.get('/api/exercises');
    return response.data;
  },

  // Crear nuevo ejercicio
  create: async (exercise: CreateExerciseRequest): Promise<Exercise> => {
    const response = await api.post('/api/exercises', exercise);
    return response.data;
  },

  // Eliminar ejercicio
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/exercises/${id}`);
  },

  // Obtener ejercicio por ID (cuando implementes en backend)
  getById: async (id: string): Promise<Exercise> => {
    const response = await api.get(`/api/exercises/${id}`);
    return response.data;
  }
};