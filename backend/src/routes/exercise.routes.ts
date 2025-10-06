import express from 'express';
import { Router } from 'express';

import Exercise from '../models/Exercise';
import {
  getExercises,
  createExercise,
  deleteExercise,
  getExerciseById,
  updateExercise,
  searchExercises,
  getExerciseStats,
  saveAIResult
  
} from '../controllers/exercise.controller';

const router = express.Router();

router.get('/', getExercises);
router.post('/', createExercise);
router.delete('/', deleteExercise);
router.get('/stats', getExerciseById);
router.get('/search', searchExercises);
router.get('/:id', getExerciseById);
router.put('/:id', updateExercise);
router.put('/:id/ai-result', saveAIResult);


// 🧠 Obtener todos los ejercicios
router.get('/', async (_req: express.Request, res: express.Response) => {
  try {
    const exercises = await Exercise.find();
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ejercicios' });
  }
});

// ➕ Crear un nuevo ejercicio
router.post('/', async (req, res) => {
  try {
    const newExercise = new Exercise(req.body);
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear ejercicio' });
    console.log(`Error : ${err}`)
  }
});

// 🗑️ Eliminar un ejercicio por ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Exercise.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Ejercicio no encontrado' });
    res.json({ message: 'Ejercicio eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar ejercicio' });
  }
});

export default router;

