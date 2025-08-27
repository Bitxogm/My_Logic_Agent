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

// Añadir estas funciones al controlador existente

// Obtener ejercicio por ID
export const getExerciseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      res.status(404).json({ error: 'Ejercicio no encontrado' });
      return;
    }
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ejercicio' });
  }
};

// Actualizar ejercicio
export const updateExercise = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedExercise) {
      res.status(404).json({ error: 'Ejercicio no encontrado' });
      return;
    }

    res.json(updatedExercise);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar ejercicio' });
  }
};

// Búsqueda avanzada de ejercicios
export const searchExercises = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      difficulty,
      tags,
      language,
      page = 1,
      limit = 10
    } = req.query;

    // Construir filtros
    const filters: any = {};

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (difficulty) filters.difficulty = difficulty;
    if (language) filters.language = { $regex: language, $options: 'i' };
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filters.tags = { $in: tagArray };
    }

    // Ejecutar búsqueda con paginación
    const exercises = await Exercise
      .find(filters)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const total = await Exercise.countDocuments(filters);

    res.json({
      exercises,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (err) {
    res.status(500).json({ error: 'Error en búsqueda' });
  }
};

// Obtener estadísticas de ejercicios
export const getExerciseStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Exercise.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byDifficulty: {
            $push: {
              difficulty: '$difficulty',
              count: 1
            }
          },
          byLanguage: {
            $push: {
              language: '$language',
              count: 1
            }
          },
          allTags: { $push: '$tags' }
        }
      },
      {
        $project: {
          total: 1,
          byDifficulty: {
            $reduce: {
              input: '$byDifficulty',
              initialValue: [],
              in: {
                $concatArrays: ['$$value', [{ difficulty: '$$this.difficulty', count: '$$this.count' }]]
              }
            }
          },
          byLanguage: {
            $reduce: {
              input: '$byLanguage',
              initialValue: [],
              in: {
                $concatArrays: ['$$value', [{ language: '$$this.language', count: '$$this.count' }]]
              }
            }
          },
          topTags: {
            $slice: [
              {
                $sortArray: {
                  input: {
                    $map: {
                      input: {
                        $setUnion: {
                          $reduce: {
                            input: '$allTags',
                            initialValue: [],
                            in: { $concatArrays: ['$$value', '$$this'] }
                          }
                        }
                      },
                      as: 'tag',
                      in: {
                        tag: '$$tag',
                        count: {
                          $size: {
                            $filter: {
                              input: {
                                $reduce: {
                                  input: '$allTags',
                                  initialValue: [],
                                  in: { $concatArrays: ['$$value', '$$this'] }
                                }
                              },
                              cond: { $eq: ['$$this', '$$tag'] }
                            }
                          }
                        }
                      }
                    }
                  },
                  sortBy: { count: -1 }
                }
              },
              10
            ]
          }
        }
      }
    ]);

    res.json(stats[0] || { total: 0, byDifficulty: [], byLanguage: [], topTags: [] });
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
};

// Guardar resultado de IA en ejercicio
export const saveAIResult = async (req: Request, res: Response)  => {
  try {
    const { type, content } = req.body; // type: 'analysis' | 'code' | 'diagram'
    
    let updateField: any = {};
    
    switch (type) {
      case 'analysis':
        updateField.aiAnalysis = content;
        break;
      case 'code':
        updateField.generatedCode = content;
        break;
      case 'diagram':
        updateField.diagramCode = content;
        break;
      default:
        return res.status(400).json({ error: 'Tipo inválido' });
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      updateField,
      { new: true }
    );

    if (!updatedExercise) {
      res.status(404).json({ error: 'Ejercicio no encontrado' });
      return;
    }

    res.json(updatedExercise);
  } catch (err) {
    res.status(500).json({ error: 'Error guardando resultado IA' });
  }
};