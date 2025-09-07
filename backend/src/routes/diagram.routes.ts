import { Router } from 'express';
import { 
  generateDiagram,
  getDiagramHistory,
  deleteDiagramEntry
 } from '../controllers/diagram.controller';


const router = Router();

router.post('/diagram', generateDiagram);
router.get('/history', getDiagramHistory);
router.delete('/history/:id', deleteDiagramEntry);

export default router;
