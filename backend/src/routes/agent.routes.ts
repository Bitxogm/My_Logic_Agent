import { Router } from 'express';
import { solveLogicExercise } from '../controllers/agent.controller';

const router = Router();

router.post('/solve', solveLogicExercise);

export default router;
