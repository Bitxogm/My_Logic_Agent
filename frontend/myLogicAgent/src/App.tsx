import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import GeneratorPage from './pages/GeneratorPage';
import ExerciseManager from './pages/ExerciseManager';
import CreateExercise from './pages/CreateExercise';
import EditExercise from './pages/EditExercise';
import ExerciseDetail from './pages/ExerciseDetail';
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
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/generator" element={<GeneratorPage />} />
          <Route path="/exercise/manage" element={<ExerciseManager />} />
          <Route path="/exercise/create" element={<CreateExercise />} />
          <Route path="/exercise/:id/edit" element={<EditExercise />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />


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