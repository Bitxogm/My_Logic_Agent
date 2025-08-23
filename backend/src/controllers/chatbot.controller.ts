import { Request, Response } from 'express';
import { queryGemini } from '../services/gemini.service';
import ChatSession, { IChatMessage } from '../models/ChatSession';
import { v4 as uuidv4 } from 'uuid';

export const chatWithBot = async (req: Request, res: Response) => {
  try {
    const { message, sessionId, context } = req.body;

    // Validación
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    // Generar sessionId si no existe
    const currentSessionId = sessionId || uuidv4();

    // Buscar o crear sesión
    let session = await ChatSession.findOne({ sessionId: currentSessionId });
    if (!session) {
      // Generar título basado en el primer mensaje
      const title = message.length > 50
        ? message.substring(0, 50) + '...'
        : message;

      session = new ChatSession({
        sessionId: currentSessionId,
        title: title, // ← AÑADIR este campo
        messages: [],
        context: context || '',
        lastActivity: new Date() // ← AÑADIR este campo también
      });
    }

    // Actualizar última actividad siempre
    session.lastActivity = new Date();
    session.updatedAt = new Date();

    // Añadir mensaje del usuario
    const userMessage: IChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    session.messages.push(userMessage);

    // Construir contexto para Gemini
    const conversationHistory = session.messages
      .slice(-10) // Últimos 10 mensajes para no sobrecargar
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `Eres un tutor de programación especializado en explicar lógica y algoritmos. 
Ayudas a estudiantes a entender ejercicios de programación paso a paso.

${context ? `Contexto del ejercicio: ${context}` : ''}

Conversación previa:
${conversationHistory}

Responde de manera clara, didáctica y amigable. Si explicas código, usa ejemplos prácticos.`;

    // Llamar a Gemini
    const botResponse = await queryGemini(systemPrompt);

    // Añadir respuesta del bot
    const assistantMessage: IChatMessage = {
      role: 'assistant',
      content: botResponse,
      timestamp: new Date()
    };
    session.messages.push(assistantMessage);

    // Actualizar timestamp
    session.updatedAt = new Date();
    await session.save();

    res.json({
      response: botResponse,
      sessionId: currentSessionId,
      messageCount: session.messages.length
    });

  } catch (error: any) {
    console.error('❌ Error en chatbot:', error);
    res.status(500).json({
      error: 'Error en el chatbot',
      detalle: error.message
    });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }

    res.json({
      sessionId: session.sessionId,
      messages: session.messages,
      context: session.context,
      createdAt: session.createdAt
    });

  } catch (error: any) {
    res.status(500).json({ error: 'Error obteniendo historial' });
  }
};

export const clearChatSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    await ChatSession.findOneAndDelete({ sessionId });
    res.json({ message: 'Sesión eliminada' });

  } catch (error: any) {
    res.status(500).json({ error: 'Error eliminando sesión' });
  }
};

export const getAllSessions = async (req: Request, res: Response) => {
  try {
    const sessions = await ChatSession
      .find()
      .select('sessionId title lastActivity createdAt')
      .sort({ lastActivity: -1 })
      .limit(20);

    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ error: 'Error obteniendo sesiones' });
  }
};