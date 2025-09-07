// backend/src/models/diagram.model.ts

import { Schema, model } from 'mongoose';

const diagramSchema = new Schema(
  {
    enunciado: { type: String, required: true },
    mermaid: { type: String, required: true }, // Código Mermaid generado
    timestamp: { type: Date, default: Date.now }
  },
  {
    versionKey: false // Evita el campo "__v" de Mongoose
  }
);

export const DiagramModel = model('DiagramResult', diagramSchema);