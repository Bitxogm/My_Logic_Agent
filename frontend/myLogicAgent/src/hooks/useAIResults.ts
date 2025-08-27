import { useState } from 'react';
import { exerciseService } from '../services';
import type { Exercise } from '../types/exercise';

interface AIResultInput {
  aiAnalysis?: string;
  generatedCode?: string;
  diagramCode?: string;
  // AÑADIR para el backend:
  type?: string;
  content?: string;
}
interface UseAIResultsReturn {
  saveAIResult: (exerciseId: string, aiData: AIResultInput) => Promise<Exercise | null>;
  isSaving: boolean;
  error: string | null;
  clearError: () => void;
  lastSaved: Exercise | null;
}

export const useAIResults = (): UseAIResultsReturn => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Exercise | null>(null);

  const saveAIResult = async (
    exerciseId: string,
    aiData: AIResultInput
  ): Promise<Exercise | null> => {
    if (!exerciseId || Object.keys(aiData).length === 0) {
      setError('ID de ejercicio o datos de IA requeridos');
      return null;
    }

    setIsSaving(true);
    setError(null);

    try {
      // CAMBIAR: Adaptar al formato que espera el backend
      let type: string;
      let content: string;

      if (aiData.aiAnalysis) {
        type = 'analysis';
        content = aiData.aiAnalysis;
      } else if (aiData.generatedCode) {
        type = 'code';
        content = aiData.generatedCode;
      } else if (aiData.diagramCode) {
        type = 'diagram';
        content = aiData.diagramCode;
      } else {
        setError('No hay datos de IA para guardar');
        return null;
      }

      const updatedExercise = await exerciseService.saveAIResult(exerciseId, { type, content });
      setLastSaved(updatedExercise);
      setError(null);
      return updatedExercise;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Error desconocido al guardar resultados de IA';

      setError(errorMessage);
      console.error('Error saving AI results:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  };
  const clearError = () => {
    setError(null);
  };

  return {
    saveAIResult,
    isSaving,
    error,
    clearError,
    lastSaved
  };
};