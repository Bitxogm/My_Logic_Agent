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
    } catch (parseError) {
      console.error('❌ Error al parsear JSON:', parseError);
      return res.status(500).json({
        error: 'Formato de respuesta inválido de Gemini',
        detalle: parseError.message,
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
