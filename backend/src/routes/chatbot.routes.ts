import { Router } from 'express';
import { 
  chatWithBot, 
  getChatHistory, 
  clearChatSession ,
  getAllSessions
} from '../controllers/chatbot.controller';

const router = Router();

// Enviar mensaje al chatbot
router.post('/', chatWithBot);

// Obtener historial de chat
router.get('/history/:sessionId', getChatHistory);
router.get('/sessions', getAllSessions);

// Limpiar sesión de chat
router.delete('/session/:sessionId', clearChatSession);

export default router;