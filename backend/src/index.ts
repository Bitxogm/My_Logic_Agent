import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import exerciseRoutes from './routes/exercise.routes';
import geminiRoutes from './routes/gemini.routes';
import agentRoutes from './routes/agent.routes';
import diagramRoutes from './routes/diagram.routes';
import chatbotRoutes from './routes/chatbot.routes'


// 🧪 Cargar variables de entorno
dotenv.config();

// 🚀 Crear instancia de Express
const app = express();

// 🛡️ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Middleware para ver todas las peticiones
app.use((req, _res, next) => {
  console.log(`📡 Petición recibida: ${req.method} ${req.url}`);
  next();
});

// ✅ Montar rutas
app.use('/api/gemini', geminiRoutes);
console.log('📦 Rutas /api/gemini cargadas');

app.use('/api/agent', agentRoutes);
console.log('📦 Rutas /api/agent cargadas');

app.use('/api/exercises', exerciseRoutes);
console.log('📦 Rutas /api/exercises cargadas');

app.use('/api/logic', diagramRoutes);
console.log('🔗 Rutas /api/logic cargadas');

app.use('/chatbot', chatbotRoutes);
console.log('🤖 Ruta /chatbot cargada');

// 🔌 Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mi-agente-logico';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// 🧠 Ruta de prueba
app.get('/', (_req, res) => {
  res.send('🧠 Agente lógico en marcha');
});



// 🧨 Iniciar servidor
// ✅ Lógica de inicio para ambos entornos (Local vs. Vercel)

// 1. Si NO estamos en producción (estamos en local), ¡iniciamos el servidor!
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor (DEV) escuchando en http://localhost:${PORT}`);
  });
}

// 2. Si estamos en producción (Vercel), exportamos la app.
// Esto es lo que Vercel ejecutará como Serverless Function.
module.exports = app;