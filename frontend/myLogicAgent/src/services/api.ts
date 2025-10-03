import axios from 'axios';

// 1. Usar el check de Vite: 
// Si estamos en Producción (Vercel), la URL base es '/', 
// que indica "el dominio actual".
// Si estamos en Desarrollo (local), la URL base sigue siendo 'http://localhost:3000'.
const API_BASE_URL = import.meta.env.PROD ? '/' : 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging
api.interceptors.request.use((config) => {
  console.log(`🌐 API Call: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;