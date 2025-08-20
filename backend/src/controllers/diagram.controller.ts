import { Request, Response } from 'express';
import { queryGemini } from '../services/gemini.service';

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

    res.status(200).json({ mermaid });
  } catch (error: any) {
    console.error('❌ Error al generar diagrama:', error);
    res.status(500).json({
      error: 'Error al generar diagrama',
      detalle: error.message
    });
  }
};
