import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exerciseService } from '../services';
import type { Exercise } from '../types/exercise';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const data = await exerciseService.getAll();
      setExercises(data);
      toast.success(`${data.length} ejercicios cargados`);
    } catch (error) {
      toast.error('Error al cargar ejercicios');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este ejercicio?')) return;

    try {
      await exerciseService.delete(id);
      setExercises(exercises.filter(ex => ex._id !== id));
      toast.success('Ejercicio eliminado');
    } catch (error) {
      toast.error('Error al eliminar ejercicio');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-4 text-lg">Cargando ejercicios...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">🧠 AgentLogic</h1>
          <p className="text-gray-600 mt-2">Tu tutor de lógica personal potenciado por IA</p>
        </div>
        <div className="flex gap-4">
          <Link to="/chat" className="btn btn-primary">
            💬 Chat IA
          </Link>
          <Link to="/generator" className="btn btn-secondary">
            🔧 Generador
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="stat-title">Ejercicios</div>
          <div className="stat-value text-primary">{exercises.length}</div>
          <div className="stat-desc">Disponibles</div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-secondary">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
            </svg>
          </div>
          <div className="stat-title">Backend</div>
          <div className="stat-value text-secondary">✅</div>
          <div className="stat-desc">Conectado</div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-accent">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <div className="stat-title">IA</div>
          <div className="stat-value text-accent">Gemini</div>
          <div className="stat-desc">1.5 Flash</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">🚀 Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-r from-primary to-secondary text-white">
            <div className="card-body">
              <h3 className="card-title">💡 Resolver Lógica</h3>
              <p>Analiza problemas con IA</p>
              <Link to="/generator" className="btn btn-ghost btn-sm">Ir →</Link>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-accent to-primary text-white">
            <div className="card-body">
              <h3 className="card-title">📊 Diagramas</h3>
              <p>Genera diagramas de flujo</p>
              <Link to="/generator" className="btn btn-ghost btn-sm">Ir →</Link>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-secondary to-accent text-white">
            <div className="card-body">
              <h3 className="card-title">💬 Chat IA</h3>
              <p>Conversa con el tutor</p>
              <Link to="/chat" className="btn btn-ghost btn-sm">Ir →</Link>
            </div>
          </div>

          {/* ← ESTA tarjeta CAMBIA */}
          <div className="card bg-gradient-to-r from-warning to-error text-white">
            <div className="card-body">
              <h3 className="card-title">📚 Gestionar</h3>
              <p>Administrar ejercicios</p>
              <Link to="/exercise/manage" className="btn btn-ghost btn-sm">Ir →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ejercicios */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">📚 Biblioteca de Ejercicios</h2>
        {/* ← ESTE botón CAMBIA */}
        <Link to="/exercise/manage" className="btn btn-primary">
          📚 Gestionar Ejercicios
        </Link>
      </div>

      {exercises.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2">No hay ejercicios guardados</h3>
          <p className="text-gray-600 mb-6">
            Puedes crear ejercicios usando nuestro generador o añadirlos manualmente
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/exercise/manage" className="btn btn-primary">
              📚 Gestionar Ejercicios
            </Link>
            <Link to="/chat" className="btn btn-secondary">
              💬 Hablar con IA
            </Link>
          </div>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div key={exercise._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="card-title text-lg">{exercise.title}</h3>
                  <div className={`badge ${exercise.difficulty === 'easy' ? 'badge-success' :
                    exercise.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                    }`}>
                    {exercise.difficulty}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {exercise.description}
                </p>

                {exercise.language && (
                  <div className="badge badge-info badge-sm mb-2">{exercise.language}</div>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {exercise.tags.map((tag, index) => (
                    <span key={index} className="badge badge-outline badge-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="card-actions justify-end">
                  <button className="btn btn-sm btn-ghost">Ver</button>
                  <button
                    onClick={() => handleDeleteExercise(exercise._id)}
                    className="btn btn-error btn-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;





