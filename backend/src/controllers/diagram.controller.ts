// backend/src/controllers/diagram.controller.ts

import { Request, Response } from 'express';
import { queryGemini } from '../services/gemini.service';
import { DiagramModel } from '../models/diagram.model';

export const generateDiagram = async (req: Request, res: Response) => {
  const { enunciado } = req.body;

  if (!enunciado || typeof enunciado !== 'string') {
    return res.status(400).json({ error: 'Falta el enunciado o es inválido' });
  }

  const prompt = `Convierte el siguiente enunciado en un diagrama de flujo en formato Mermaid. 
    Devuelve solo el código Mermaid, sin explicaciones, sin formato Markdown, 
    sin comillas dobles dentro de los nodos, y con saltos de línea adecuados.
    Enunciado: ${enunciado}`;

  try {
    const raw = await queryGemini(prompt);
    const mermaid = raw
      .replace(/```mermaid\s*/i, '')
      .replace(/```/g, '')
      .replace(/;(?=\n)/g, '')
      .replace(/"([^"]*)"/g, '$1') // elimina comillas dobles dentro de nodos
      .trim();

    if (!mermaid.includes('graph TD')) {
      return res.status(500).json({ error: 'La respuesta no contiene un diagrama válido' });
    }

    console.log('📈 Diagrama Mermaid generado:', mermaid);

    // NUEVO: Guardar en MongoDB
    console.log('🧠 Guardando diagrama en MongoDB...');
    await DiagramModel.create({
      enunciado,
      mermaid,
      timestamp: new Date()
    });
    console.log('✅ Diagrama guardado exitoso');

    res.status(200).json({ mermaid });
  } catch (error: any) {
    console.error('❌ Error al generar diagrama:', error);
    res.status(500).json({
      error: 'Error al generar diagrama',
      detalle: error.message
    });
  }
};

// NUEVO: Obtener historial de diagramas
export const getDiagramHistory = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const history = await DiagramModel
      .find()
      .sort({ timestamp: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await DiagramModel.countDocuments();

    res.json({
      history,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo historial de diagramas' });
  }
};

// NUEVO: Eliminar diagrama del historial
export const deleteDiagramEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await DiagramModel.findByIdAndDelete(id);
    res.json({ message: 'Diagrama eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando diagrama' });
  }
};