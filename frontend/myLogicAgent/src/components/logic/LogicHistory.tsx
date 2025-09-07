// frontend/src/components/logic/LogicHistory.tsx

import { useState, useEffect } from 'react';
import { logicService, type LogicHistoryEntry } from '../../services/logicService';
import toast from 'react-hot-toast';

interface LogicHistoryProps {
  onSelectEntry: (entry: LogicHistoryEntry) => void;
  onNewLogic: () => void;
}

const LogicHistory = ({ onSelectEntry, onNewLogic }: LogicHistoryProps) => {
  const [entries, setEntries] = useState<LogicHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await logicService.getHistory({ limit: 50 });
      setEntries(data.history);
    } catch (error) {
      toast.error('Error cargando historial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEntry = (entry: LogicHistoryEntry) => {
    setSelectedId(entry._id);
    onSelectEntry(entry);
  };

  const handleDeleteEntry = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se seleccione al eliminar
    
    if (!confirm('¿Eliminar esta consulta del historial?')) return;
    
    try {
      await logicService.deleteEntry(id);
      setEntries(entries.filter(entry => entry._id !== id));
      toast.success('Entrada eliminada');
      
      // Si era la seleccionada, limpiar selección
      if (selectedId === id) {
        setSelectedId('');
      }
    } catch (error) {
      toast.error('Error eliminando entrada');
    }
  };

  const getModeIcon = (modo: string) => {
    switch (modo) {
      case 'statement': return '📝';
      case 'code': return '💻';
      case 'diagram': return '📊';
      default: return '🤔';
    }
  };

  const getModeLabel = (modo: string) => {
    switch (modo) {
      case 'statement': return 'Análisis';
      case 'code': return 'Código';
      case 'diagram': return 'Diagrama';
      default: return 'Consulta';
    }
  };

  const getDifficultyColor = (nivel: string) => {
    switch (nivel) {
      case 'fácil': return 'badge-success';
      case 'medio': return 'badge-warning';
      case 'difícil': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <span className="loading loading-spinner loading-sm"></span>
        <span className="ml-2 text-sm">Cargando historial...</span>
      </div>
    );
  }

  return (
    <div className="w-80 bg-base-200 h-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">📚 Historial de Lógica</h3>
        <button 
          onClick={onNewLogic}
          className="btn btn-primary btn-sm"
          title="Nueva consulta"
        >
          ➕
        </button>
      </div>

      {/* Lista de entradas */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm">No hay consultas guardadas</p>
            <button 
              onClick={onNewLogic}
              className="btn btn-primary btn-sm mt-2"
            >
              Hacer consulta
            </button>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry._id}
              onClick={() => handleSelectEntry(entry)}
              className={`
                card bg-base-100 p-3 cursor-pointer transition-all hover:bg-base-300
                ${selectedId === entry._id ? 'ring-2 ring-primary' : ''}
              `}
            >
              {/* Header de la entrada */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getModeIcon(entry.modo)}</span>
                  <span className="font-medium text-sm">{getModeLabel(entry.modo)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`badge badge-xs ${getDifficultyColor(entry.nivel)}`}>
                    {entry.nivel}
                  </span>
                  <button
                    onClick={(e) => handleDeleteEntry(entry._id, e)}
                    className="btn btn-ghost btn-xs text-error hover:bg-error hover:text-white"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Enunciado */}
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {entry.enunciado}
              </p>

              {/* Tipo y fecha */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="badge badge-outline badge-xs">{entry.tipo}</span>
                <span>
                  {new Date(entry.timestamp).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con info */}
      <div className="mt-4 p-2 bg-base-300 rounded text-xs text-center text-gray-500">
        💡 Haz clic en una entrada para recuperar el resultado
      </div>
    </div>
  );
};

export default LogicHistory;