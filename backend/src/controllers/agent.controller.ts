import { Request, Response } from 'express';
import { queryGemini } from '../services/gemini.service';
import { LogicRequest, LogicResponse } from '../types/agent.types';
import { LogicModel } from '../models/logic.model';

export const solveLogicExercise = async (req: Request, res: Response) => {
  console.log('📥 Petición recibida en /api/agent/solve');

  const { modo, enunciado, opciones }: LogicRequest = req.body;

  // 🛡️ Validación básica
  if (!enunciado || typeof enunciado !== 'string') {
    return res.status(400).json({
      error: 'Falta el campo enunciado en la petición'
    });
  }

  console.log('🧾 Datos recibidos:', { modo, enunciado, opciones });

  const prompt = `Eres un agente lógico especializado en resolver ejercicios de lógica matemática, razonamiento abstracto y problemas tipo test. Tu tarea es analizar el enunciado, identificar la lógica subyacente y ofrecer una solución clara y estructurada.

Devuelve la respuesta exclusivamente en formato JSON plano. No uses bloques Markdown como \\\`\\\`\\\`json ni ningún otro tipo de formato. No incluyas texto introductorio ni explicaciones fuera del JSON.

Formato esperado:
{
  "respuesta": "...",
  "explicacion": "...",
  "tipo": "...",
  "nivel": "fácil | medio | difícil"
}

Ejercicio:
${enunciado}
${opciones ? 'Opciones: ' + opciones.join(', ') : ''}`;

  try {
    const raw = await queryGemini(prompt);

    const limpio = raw
      .replace(/```json\s*/i, '')
      .replace(/```/g, '')
      .trim();

    let parsed: LogicResponse;
    try {
      parsed = JSON.parse(limpio);
    } catch (parseError: unknown) {
      console.error('❌ Error al parsear JSON:', parseError);
      const detail = parseError instanceof Error ? parseError.message : 'Error de parseo desconocido.';

      return res.status(500).json({
        error: 'Formato de respuesta inválido de Gemini',
        detalle: detail,
        raw: raw
      });
    }

    console.log('🧠 Guardando en MongoDB...');
    await LogicModel.create({
      modo,
      enunciado,
      opciones,
      ...parsed,
      timestamp: new Date()
    });
    console.log('✅ Guardado exitoso');

    res.status(200).json(parsed);
  } catch (error: any) {
    console.error('❌ Error general en solveLogicExercise:', error);
    res.status(500).json({
      error: 'Respuesta no válida de Gemini',
      detalle: error.message,
      raw: error?.raw || null
    });
  }
};
// AÑADIR estas funciones al final del archivo:

export const getLogicHistory = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const history = await LogicModel
      .find()
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await LogicModel.countDocuments();

    res.json({
      history,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo historial' });
  }
};

export const deleteLogicEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await LogicModel.findByIdAndDelete(id);
    res.json({ message: 'Entrada eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando entrada' });
  }
};