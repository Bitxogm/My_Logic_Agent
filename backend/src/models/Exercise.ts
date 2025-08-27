import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  code?: string;
  language?: string;
  createdAt: Date;
  aiAnalysis?: string;      // Análisis generadou
  generatedCode?: string;   // Código generado por IA
  diagramCode?: string;     // Código Mermaid del diagrama
}

const ExerciseSchema: Schema = new Schema<IExercise>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  tags: { type: [String], default: [] },
  code: { type: String },
  language: { type: String },
  createdAt: { type: Date, default: Date.now },
  aiAnalysis: { type: String },
  generatedCode: { type: String },
  diagramCode: { type: String },
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);
