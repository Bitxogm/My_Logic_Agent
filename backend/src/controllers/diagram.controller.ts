// backend/src/controllers/diagram.controller.ts

import { Request, Response } from 'express';
import { queryGemini } from '../services/gemini.service';
import { DiagramModel } from '../models/diagram.model';



// backend/src/controllers/diagram.controller.ts

export const generateDiagram = async (req: Request, res: Response) => {
  const { enunciado } = req.body;

  if (!enunciado || typeof enunciado !== 'string') {
    return res.status(400).json({ error: 'Falta el enunciado o es inválido' });
  }

  // PROMPT MEJORADO con regla adicional sobre corchetes
  const prompt = `Genera un diagrama de flujo en formato Mermaid para el siguiente algoritmo.

REGLAS ESTRICTAS:
1. Usa SOLO la sintaxis: graph TD
2. Los nodos deben ser simples: A[texto corto], B{pregunta?}, C((inicio))
3. NO uses paréntesis ni corchetes dobles dentro de los nodos
4. NO uses comillas dentro de los nodos
5. Mantén los textos de nodos MUY cortos (máximo 30 caracteres)
6. Las conexiones: A-->B o A-->|Si|B
7. Cada nodo SOLO un corchete de apertura y uno de cierre: A[texto]
8. NO añadas explicaciones

EJEMPLO CORRECTO:
graph TD
    A((Inicio))
    B[Leer N]
    C{Es par?}
    D[Mostrar par]
    E[Mostrar impar]
    F((Fin))
    A-->B
    B-->C
    C-->|Si|D
    C-->|No|E
    D-->F
    E-->F

Algoritmo:
${enunciado}

SOLO código Mermaid, sin texto adicional.`;

  try {
    const raw = await queryGemini(prompt);
    
    // LIMPIEZA AGRESIVA
    let mermaid = raw
      .replace(/```mermaid\s*/gi, '')
      .replace(/```/g, '')
      .replace(/;(?=\n)/g, '')
      .trim();

    // Limpiar paréntesis dentro de corchetes/llaves
    mermaid = mermaid.replace(/\[([^\]]*)\(([^\]]*)\)/g, '[$1 $2]');
    mermaid = mermaid.replace(/\{([^\}]*)\(([^\}]*)\)/g, '{$1 $2}');
    
    // NUEVO: Limpiar corchetes dobles incorrectos
    mermaid = mermaid.replace(/\[\[/g, '[');
    mermaid = mermaid.replace(/\]\]/g, ']');
    
    // Remover comillas dobles
    mermaid = mermaid.replace(/"([^"]*)"/g, '$1');

    if (!mermaid.includes('graph TD') && !mermaid.includes('graph LR')) {
      return res.status(500).json({ error: 'La respuesta no contiene un diagrama válido' });
    }

    console.log('📈 Diagrama Mermaid generado:', mermaid);

    // Guardar en MongoDB
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
// Obtener historial de diagramas
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

// Eliminar diagrama del historial
export const deleteDiagramEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await DiagramModel.findByIdAndDelete(id);
    res.json({ message: 'Diagrama eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando diagrama' });
  }
};