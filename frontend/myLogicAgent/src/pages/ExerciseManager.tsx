import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exerciseService } from '../services';
import type { Exercise, ExerciseSearchParams } from '../types/exercise';
import toast from 'react-hot-toast';

const ExerciseManager = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<ExerciseSearchParams>({
    page: 1,
    limit: 12
  });

  useEffect(() => {
    loadExercises();
  }, [searchParams]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseService.search(searchParams);
      setExercises(data.exercises);
    } catch (error) {
      toast.error('Error cargando ejercicios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar ejercicio "${title}"?`)) return;
    
    try {
      await exerciseService.delete(id);
      setExercises(exercises.filter(ex => ex._id !== id));
      toast.success('Ejercicio eliminado');
    } catch (error) {
      toast.error('Error eliminando ejercicio');
    }
  };

  const handleSearch = (search: string) => {
    setSearchParams(prev => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: keyof ExerciseSearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">📚 Gestión de Ejercicios</h1>
          <p className="text-gray-600">Administra tu biblioteca de ejercicios</p>
        </div>
        <div className="flex gap-2">
          <Link to="/exercise/create" className="btn btn-primary">
            ➕ Nuevo Ejercicio
          </Link>
          <Link to="/dashboard" className="btn btn-ghost">
            ← Volver
          </Link>
        </div>
      </div>

      {/* Filtros de búsqueda */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda por texto */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">🔍 Buscar</span>
              </label>
              <input
                type="text"
                placeholder="Título o descripción..."
                className="input input-bordered"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filtro por dificultad */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">📊 Dificultad</span>
              </label>
              <select 
                className="select select-bordered"
                onChange={(e) => handleFilterChange('difficulty', e.target.value || undefined)}
              >
                <option value="">Todas</option>
                <option value="easy">Fácil</option>
                <option value="medium">Medio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>

            {/* Filtro por lenguaje */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">💻 Lenguaje</span>
              </label>
              <select 
                className="select select-bordered"
                onChange={(e) => handleFilterChange('language', e.target.value || undefined)}
              >
                <option value="">Todos</option>
                <option value="Python">Python</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">&nbsp;</span>
              </label>
              <button 
                onClick={() => setSearchParams({ page: 1, limit: 12 })}
                className="btn btn-outline"
              >
                🗑️ Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de ejercicios */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-4">Cargando ejercicios...</span>
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2">No se encontraron ejercicios</h3>
          <p className="text-gray-600 mb-4">
            {searchParams.search ? 'Intenta con otros términos de búsqueda' : 'Crea tu primer ejercicio'}
          </p>
          <Link to="/exercise/create" className="btn btn-primary">
            Crear Ejercicio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div key={exercise._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                {/* Header con título y dificultad */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="card-title text-lg line-clamp-2">
                    {exercise.title}
                  </h3>
                  <div className={`badge shrink-0 ml-2 ${
                    exercise.difficulty === 'easy' ? 'badge-success' :
                    exercise.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {exercise.difficulty}
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {exercise.description}
                </p>

                {/* Lenguaje */}
                {exercise.language && (
                  <div className="badge badge-info badge-sm mb-2">
                    {exercise.language}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
                  {exercise.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="badge badge-outline badge-sm">
                      {tag}
                    </span>
                  ))}
                  {exercise.tags.length > 3 && (
                    <span className="badge badge-outline badge-sm">
                      +{exercise.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Acciones */}
                <div className="card-actions justify-end">
                  <Link 
                    to={`/exercise/${exercise._id}`}
                    className="btn btn-sm btn-ghost"
                  >
                    👁️ Ver
                  </Link>
                  <Link 
                    to={`/exercise/${exercise._id}/edit`}
                    className="btn btn-sm btn-primary"
                  >
                    ✏️ Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(exercise._id, exercise.title)}
                    className="btn btn-sm btn-error"
                  >
                    🗑️
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

export default ExerciseManager;