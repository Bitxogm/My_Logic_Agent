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