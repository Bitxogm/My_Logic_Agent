import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-100">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rutas temporales */}
          <Route path="/chat" element={<div className="p-8 text-center"><h1 className="text-2xl">🚧 Chat en construcción</h1></div>} />
          <Route path="/generator" element={<div className="p-8 text-center"><h1 className="text-2xl">🚧 Generador en construcción</h1></div>} />
          
          {/* 404 */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-6xl font-bold text-primary">404</h1>
              <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
              <a href="/" className="btn btn-primary mt-6">Volver al inicio</a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;