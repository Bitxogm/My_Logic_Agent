import { Router } from 'express';
import {
  solveLogicExercise ,
  getLogicHistory,
  deleteLogicEntry

} from '../controllers/agent.controller';

const router = Router();

router.post('/solve', solveLogicExercise);
router.get('/history', getLogicHistory);
router.delete('/history/:id', deleteLogicEntry);

export default router;
