import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const { DB_USER, DB_PASSWORD } = process.env

// const uri = 'mongodb+srv://otakuUser:tuContraseña@cluster0.mongodb.net/myLogicAgent?retryWrites=true&w=majority';
const uri = `mongodb+srv: ${DB_USER}:${DB_PASSWORD}@cluster0.tpcuohl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// mongodb+srv: LogicAgentUser:yF8hOsoTjQ61LhFs@cluster0.tpcuohl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (err) {
    console.error('❌ Error de conexión:', err);
  }
};
