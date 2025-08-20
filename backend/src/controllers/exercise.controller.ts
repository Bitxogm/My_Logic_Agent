import { Request, Response } from 'express';
import Exercise from '../models/Exercise';


// Otener todos los ejercicios.
export const getExercises = async (_req: Request, res: Response): Promise<void> => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ejercicios' });
  }
};

// Crear nuevo ejercicio
export const createExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const newExercise = new Exercise(req.body);
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear ejercicio' });
  }
};

// Eliminar ejercicio por ID
export const deleteExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Ejercicio no encontrado' });
      return;
    }
    res.json({ message: 'Ejercicio eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar ejercicio' });
  }
};
