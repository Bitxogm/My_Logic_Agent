export interface Exercise {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  code?: string;
  language?: string;
  createdAt: string;
}

export interface CreateExerciseRequest {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  code?: string;
  language?: string;
}

// Añadir estos tipos al archivo existente

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
}

export interface UpdateExerciseRequest {
  title?: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  code?: string;
  language?: string;
}