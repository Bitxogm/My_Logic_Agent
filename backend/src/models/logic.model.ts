import { Schema, model } from 'mongoose';

const logicSchema = new Schema(
  {
    modo: { type: String, default: 'normal' }, // Puedes ajustar el default si quieres
    enunciado: { type: String, required: true },
    opciones: [{ type: String }],
    respuesta: { type: String, required: true },
    explicacion: { type: String, required: true },
    tipo: { type: String, required: true },
    nivel: {
      type: String,
      enum: ['fácil', 'medio', 'difícil'],
      required: true
    },
    timestamp: { type: Date, default: Date.now }
  },
  {
    versionKey: false // 🔕 Evita el campo "__v" de Mongoose
  }
);

export const LogicModel = model('LogicResult', logicSchema);
