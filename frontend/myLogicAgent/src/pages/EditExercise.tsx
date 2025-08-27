import { useState, useEffect, useCallback} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { exerciseService } from '../services';
import type { Exercise, UpdateExerciseRequest } from '../types/exercise';
import toast from 'react-hot-toast';

const EditExercise = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  
  const [formData, setFormData] = useState<UpdateExerciseRequest>({
    title: '',
    description: '',
    difficulty: 'medium',
    tags: [],
    code: '',
    language: 'Python'
  });

  const [currentTag, setCurrentTag] = useState('');

  // ✅ Envolver loadExercise en useCallback
const loadExercise = useCallback(async (exerciseId: string) => {
  try {
    const data = await exerciseService.getById(exerciseId);
    setExercise(data);
    setFormData({
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      tags: data.tags,
      code: data.code || '',
      language: data.language || 'Python'
    });
  } catch (error) {
    toast.error('Error cargando ejercicio');
    navigate('/exercise/manage');
  } finally {
    setLoading(false);
  }
}, [navigate]); // ← Solo depende de navigate

// ✅ Ahora el useEffect está bien
useEffect(() => {
  if (id) {
    loadExercise(id);
  }
}, [id, loadExercise]); // ← Ambas dependencias

  const handleInputChange = (field: keyof UpdateExerciseRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (!currentTag.trim()) return;
    
    const newTag = currentTag.trim().toLowerCase();
    if (!formData.tags?.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }));
    }
    setCurrentTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    // Validaciones básicas
    if (!formData.title?.trim()) {
      toast.error('El título es requerido');
      return;
    }
    
    if (!formData.description?.trim()) {
      toast.error('La descripción es requerida');
      return;
    }

    setSaving(true);
    
    try {
      await exerciseService.update(id, {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim()
      });
      
      toast.success('Ejercicio actualizado exitosamente');
      navigate('/exercise/manage');
    } catch (error) {
      toast.error('Error al actualizar ejercicio');
    } finally {
      setSaving(false);
    }
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
          <h3 className="text-xl font-bold mb-2">Ejercicio no encontrado</h3>
          <button 
            onClick={() => navigate('/exercise/manage')}
            className="btn btn-primary"
          >
            Volver a gestión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">✏️ Editar Ejercicio</h1>
          <p className="text-gray-600">Modificando: {exercise.title}</p>
        </div>
        <button 
          onClick={() => navigate('/exercise/manage')}
          className="btn btn-ghost"
        >
          ← Volver
        </button>
      </div>

      {/* Formulario */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            
            {/* Título */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">📝 Título *</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Cálculo del área de un rectángulo"
                className="input input-bordered"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            {/* Descripción */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">📖 Descripción *</span>
              </label>
              <textarea
                placeholder="Describe detalladamente qué debe hacer el ejercicio..."
                className="textarea textarea-bordered h-32"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            {/* Fila con dificultad y lenguaje */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              
              {/* Dificultad */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">📊 Dificultad</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                >
                  <option value="easy">🟢 Fácil</option>
                  <option value="medium">🟡 Medio</option>
                  <option value="hard">🔴 Difícil</option>
                </select>
              </div>

              {/* Lenguaje */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">💻 Lenguaje</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="C#">C#</option>
                  <option value="PHP">PHP</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Go">Go</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">🏷️ Tags</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Añadir tag..."
                  className="input input-bordered flex-1"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn btn-primary"
                >
                  Añadir
                </button>
              </div>
              
              {/* Lista de tags */}
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="badge badge-primary gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-xs hover:text-red-300"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              
              {/* Tags sugeridos */}
              <div className="mt-2">
                <span className="text-sm text-gray-500">Sugeridos: </span>
                {['algoritmos', 'loops', 'condicionales', 'funciones', 'arrays', 'strings'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!formData.tags?.includes(tag)) {
                        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
                      }
                    }}
                    className="btn btn-ghost btn-xs mx-1 text-primary"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Código de solución (opcional) */}
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">💻 Código de solución (opcional)</span>
              </label>
              <textarea
                placeholder="# Código de ejemplo o solución&#10;def mi_funcion():&#10;    pass"
                className="textarea textarea-bordered font-mono h-40"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
              />
            </div>

            {/* Botones */}
            <div className="card-actions justify-end">
              <button
                type="button"
                onClick={() => navigate('/exercise/manage')}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    ✅ Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditExercise;