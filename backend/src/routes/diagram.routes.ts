import { Router } from 'express';
import { generateDiagram } from '../controllers/diagram.controller';

const router = Router();

router.post('/diagram', generateDiagram);

export default router;
