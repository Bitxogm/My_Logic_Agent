// frontend/src/types/exercise.ts

export interface Exercise {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  code?: string;
  language?: string;
  createdAt: string;
  updatedAt?: string; // Añadido para consistencia
  
  // Campos IA (ya existían)
  aiAnalysis?: string;
  generatedCode?: string;
  diagramCode?: string;
}

export interface CreateExerciseRequest {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  code?: string;
  language?: string;
}

export interface UpdateExerciseRequest {
  title?: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  code?: string;
  language?: string;
  
  // AÑADIDO: Permitir actualización de campos AI
  aiAnalysis?: string;
  generatedCode?: string;
  diagramCode?: string;
}

export interface ExerciseSearchParams {
  search?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  language?: string;
  page?: number;
  limit?: number;
}

export interface ExerciseSearchResponse {
  exercises: Exercise[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export interface ExerciseStats {
  total: number;
  byDifficulty: Array<{ difficulty: string; count: number }>;
  byLanguage: Array<{ language: string; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
  
  // AÑADIDO: Estadísticas de contenido IA
  withAIAnalysis?: number;
  withGeneratedCode?: number;
  withDiagrams?: number;
}

// NUEVO: Tipo específico para datos de IA
export interface AIResultInput {
  // Backend actual format
  type?: string;
  content?: string;
  // Frontend format (mantener para compatibilidad)
  aiAnalysis?: string;
  generatedCode?: string;
  diagramCode?: string;
}