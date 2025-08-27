import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { exerciseService, agentService } from '../services';
import type { Exercise } from '../types/exercise';
import CodeViewer from '../components/CodeViewer';
import toast from 'react-hot-toast';

const ExerciseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzingCode, setAnalyzingCode] = useState(false);
  const [generatingDiagram, setGeneratingDiagram] = useState(false);


  // ✅ Envolver loadExercise en useCallback
  const loadExercise = useCallback(async (exerciseId: string) => {
    try {
      const data = await exerciseService.getById(exerciseId);
      setExercise(data);
    } catch (error) {
      toast.error('Error cargando ejercicio');
      navigate('/exercise/manage');
    } finally {
      setLoading(false);
    }
  }, [navigate]); // ← Solo depende de navigate

  // ✅ useEffect con ambas dependencias
  useEffect(() => {
    if (id) {
      loadExercise(id);
    }
  }, [id, loadExercise]); // ← Ambas dependencias
  const handleAnalyzeWithAI = async () => {
    if (!exercise) return;

    setAnalyzingCode(true);
    try {
      await agentService.solveLogic({
        modo: 'code',
        enunciado: exercise.description
      });

      // Navegar al chat con el análisis
      toast.success('Análisis generado. Redirigiendo al chat...');
      setTimeout(() => {
        navigate('/chat');
      }, 1500);

    } catch (error) {
      toast.error('Error analizando ejercicio');
    } finally {
      setAnalyzingCode(false);
    }
  };

  const handleGenerateDiagram = async () => {
    if (!exercise) return;

    setGeneratingDiagram(true);
    try {
      await agentService.generateDiagram({
        enunciado: `Crear diagrama de flujo para: ${exercise.title}. ${exercise.description}`
      });

      // Navegar al generador con el diagrama
      toast.success('Diagrama generado. Redirigiendo...');
      setTimeout(() => {
        navigate('/generator');
      }, 1500);

    } catch (error) {
      toast.error('Error generando diagrama');
    } finally {
      setGeneratingDiagram(false);
    }
  };

  const handleDelete = async () => {
    if (!exercise || !id) return;

    if (!confirm(`¿Eliminar ejercicio "${exercise.title}"?`)) return;

    try {
      await exerciseService.delete(id);
      toast.success('Ejercicio eliminado');
      navigate('/exercise/manage');
    } catch (error) {
      toast.error('Error eliminando ejercicio');
    }
  };

  const handleChatWithContext = () => {
  // Navegar al chat con query params
  navigate(`/chat?exercise=${id}&context=${encodeURIComponent(exercise.title + ': ' + exercise.description)}`);
};


  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-4">Cargando ejercicio...</span>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold mb-2">Ejercicio no encontrado</h3>
          <Link to="/exercise/manage" className="btn btn-primary">
            Volver a gestión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-primary">{exercise.title}</h1>
            <div className={`badge badge-lg ${exercise.difficulty === 'easy' ? 'badge-success' :
              exercise.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
              }`}>
              {exercise.difficulty}
            </div>
          </div>

          {exercise.language && (
            <div className="badge badge-info mr-2">{exercise.language}</div>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {exercise.tags.map((tag, index) => (
              <span key={index} className="badge badge-outline badge-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/exercise/${id}/edit`}
            className="btn btn-primary btn-sm"
          >
            ✏️ Editar
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-error btn-sm"
          >
            🗑️ Eliminar
          </button>
          <Link
            to="/exercise/manage"
            className="btn btn-ghost btn-sm"
          >
            ← Volver
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Descripción */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">📖 Descripción</h2>
              <div className="prose max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {exercise.description}
                </p>
              </div>
            </div>
          </div>

          {/* Código de solución */}
          {exercise.code && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">💻 Código de Solución</h2>
                <CodeViewer
                  code={exercise.code}
                  language={exercise.language?.toLowerCase()}
                  title="Solución"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Información del ejercicio */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">ℹ️ Información</h3>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Creado:</span>
                  <p className="font-medium">
                    {new Date(exercise.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Dificultad:</span>
                  <p className="font-medium capitalize">{exercise.difficulty}</p>
                </div>

                {exercise.language && (
                  <div>
                    <span className="text-sm text-gray-500">Lenguaje:</span>
                    <p className="font-medium">{exercise.language}</p>
                  </div>
                )}

                <div>
                  <span className="text-sm text-gray-500">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {exercise.tags.map((tag, index) => (
                      <span key={index} className="badge badge-outline badge-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones con IA */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">🤖 Acciones con IA</h3>

              <div className="space-y-3">
                <button
                  onClick={handleAnalyzeWithAI}
                  disabled={analyzingCode}
                  className="btn btn-primary w-full"
                >
                  {analyzingCode ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Analizando...
                    </>
                  ) : (
                    <>
                      🧠 Analizar con IA
                    </>
                  )}
                </button>

                <button
                  onClick={handleGenerateDiagram}
                  disabled={generatingDiagram}
                  className="btn btn-secondary w-full"
                >
                  {generatingDiagram ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Generando...
                    </>
                  ) : (
                    <>
                      📊 Crear Diagrama
                    </>
                  )}
                </button>
                <button
                  onClick={handleChatWithContext}
                  className="btn btn-accent w-full"
                >
                  💬 Preguntar al Chat
                </button>

              </div>

              <div className="mt-4 text-xs text-gray-500">
                💡 Usa estas herramientas para obtener ayuda con el ejercicio
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;