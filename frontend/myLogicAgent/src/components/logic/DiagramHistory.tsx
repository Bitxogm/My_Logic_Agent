// frontend/src/components/logic/DiagramHistory.tsx

import { useState, useEffect } from 'react';
import { diagramService, type DiagramHistoryEntry } from '../../services/diagramService';
import toast from 'react-hot-toast';

interface DiagramHistoryProps {
  onSelectEntry: (entry: DiagramHistoryEntry) => void;
  onNewDiagram: () => void;
}

const DiagramHistory = ({ onSelectEntry, onNewDiagram }: DiagramHistoryProps) => {
  const [entries, setEntries] = useState<DiagramHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await diagramService.getHistory({ limit: 50 });
      setEntries(data.history);
    } catch (error) {
      toast.error('Error cargando historial de diagramas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEntry = (entry: DiagramHistoryEntry) => {
    setSelectedId(entry._id);
    onSelectEntry(entry);
  };

  const handleDeleteEntry = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('¿Eliminar este diagrama del historial?')) return;
    
    try {
      await diagramService.deleteEntry(id);
      setEntries(entries.filter(entry => entry._id !== id));
      toast.success('Diagrama eliminado');
      
      if (selectedId === id) {
        setSelectedId('');
      }
    } catch (error) {
      toast.error('Error eliminando diagrama');
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
        <h3 className="font-bold">📊 Historial de Diagramas</h3>
        <button 
          onClick={onNewDiagram}
          className="btn btn-primary btn-sm"
          title="Nuevo diagrama"
        >
          ➕
        </button>
      </div>

      {/* Lista de entradas */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm">No hay diagramas guardados</p>
            <button 
              onClick={onNewDiagram}
              className="btn btn-primary btn-sm mt-2"
            >
              Crear diagrama
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
                  <span className="text-lg">📊</span>
                  <span className="font-medium text-sm">Diagrama</span>
                </div>
                <button
                  onClick={(e) => handleDeleteEntry(entry._id, e)}
                  className="btn btn-ghost btn-xs text-error hover:bg-error hover:text-white"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>

              {/* Enunciado */}
              <p className="text-xs text-gray-600 mb-2 line-clamp-3">
                {entry.enunciado}
              </p>

              {/* Preview del diagrama (primera línea del mermaid) */}
              <div className="text-xs text-gray-500 mb-2 bg-gray-100 p-1 rounded font-mono">
                {entry.mermaid.split('\n')[0].substring(0, 30)}...
              </div>

              {/* Fecha */}
              <div className="text-xs text-gray-500 text-right">
                {new Date(entry.timestamp).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con info */}
      <div className="mt-4 p-2 bg-base-300 rounded text-xs text-center text-gray-500">
        💡 Haz clic en una entrada para recuperar el diagrama
      </div>
    </div>
  );
};

export default DiagramHistory;