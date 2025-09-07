// frontend/src/pages/GeneratorPage.tsx

import { useState } from 'react';
import { agentService } from '../services';
import toast from 'react-hot-toast';
import type { LogicResponse, DiagramResponse } from '../types/agent';
import type { LogicHistoryEntry } from '../services/logicService';
import MermaidViewer from '../components/MermaidViewer';
import CodeViewer from '../components/CodeViewer';
import LogicHistory from '../components/logic/LogicHistory';
import DiagramHistory from '../components/logic/DiagramHistory';
import type { DiagramHistoryEntry } from '../services/diagramService';

const GeneratorPage = () => {
  // Estados para los 3 modos
  const [activeMode, setActiveMode] = useState<'statement' | 'diagram' | 'code'>('statement');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados para resultados
  const [logicResult, setLogicResult] = useState<LogicResponse | null>(null);
  const [diagramResult, setDiagramResult] = useState<DiagramResponse | null>(null);

  // Estados para historial
  const [showHistory, setShowHistory] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<LogicHistoryEntry | null>(null);

  // Estados para historial de diagramas
  const [showDiagramHistory, setShowDiagramHistory] = useState(false);
  const [currentDiagramEntry, setCurrentDiagramEntry] = useState<DiagramHistoryEntry | null>(null);

  // Función para procesar según el modo activo
  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error('Por favor, introduce un enunciado');
      return;
    }

    setIsLoading(true);
    // Limpiar resultados anteriores
    setLogicResult(null);
    setDiagramResult(null);
    setCurrentEntry(null);

    try {
      if (activeMode === 'diagram') {
        // Generar diagrama
        const result = await agentService.generateDiagram({
          enunciado: inputText
        });
        setDiagramResult(result);
        toast.success('Diagrama generado');
      } else {
        // Statement o Code mode
        const result = await agentService.solveLogic({
          modo: activeMode,
          enunciado: inputText
        });
        setLogicResult(result);
        toast.success('Análisis completado');
      }
    } catch (error) {
      toast.error('Error al generar');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar selección del historial
  const handleSelectHistoryEntry = (entry: LogicHistoryEntry) => {
    // Cargar los datos de la entrada seleccionada
    setActiveMode(entry.modo);
    setInputText(entry.enunciado);
    setCurrentEntry(entry);

    // Mostrar el resultado según el tipo
    if (entry.modo === 'diagram') {
      // Para diagramas, tendríamos que generar de nuevo o guardar el mermaid en el historial
      // Por ahora, limpiamos y sugerimos regenerar
      setDiagramResult(null);
      setLogicResult(null);
      toast.info('Entrada cargada. Presiona "Generar" para recrear el diagrama.');
    } else {
      // Para statement y code, mostramos el resultado guardado
      setLogicResult({
        respuesta: entry.respuesta,
        explicacion: entry.explicacion,
        tipo: entry.tipo,
        nivel: entry.nivel
      });
      setDiagramResult(null);
    }

    setShowHistory(false); // Cerrar sidebar
    toast.success('Entrada del historial cargada');
  };

  // Manejar selección del historial de diagramas
  const handleSelectDiagramEntry = (entry: DiagramHistoryEntry) => {
    setActiveMode('diagram');
    setInputText(entry.enunciado);
    setCurrentDiagramEntry(entry);
    setDiagramResult({ mermaid: entry.mermaid });
    setLogicResult(null);
    setShowDiagramHistory(false);
    toast.success('Diagrama del historial cargado');
  };

  const handleNewDiagram = () => {
    setActiveMode('diagram');
    setInputText('');
    setDiagramResult(null);
    setCurrentDiagramEntry(null);
    setShowDiagramHistory(false);
    toast.success('Listo para nuevo diagrama');
  };

  // Limpiar para nueva consulta
  const handleNewLogic = () => {
    setInputText('');
    setLogicResult(null);
    setDiagramResult(null);
    setCurrentEntry(null);
    setShowHistory(false);
    toast.success('Listo para nueva consulta');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar con historial */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:relative lg:bg-transparent">
          <div className="bg-base-200 h-full lg:relative">
            <button
              onClick={() => setShowHistory(false)}
              className="btn btn-ghost btn-sm absolute top-2 right-2 lg:hidden"
            >
              ✕
            </button>
            <LogicHistory
              onSelectEntry={handleSelectHistoryEntry}
              onNewLogic={handleNewLogic}
            />
          </div>
        </div>
      )}

      {/* Sidebar con historial de diagramas */}
      {showDiagramHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:relative lg:bg-transparent">
          <div className="bg-base-200 h-full lg:relative">
            <button
              onClick={() => setShowDiagramHistory(false)}
              className="btn btn-ghost btn-sm absolute top-2 right-2 lg:hidden"
            >
              ✕
            </button>
            <DiagramHistory
              onSelectEntry={handleSelectDiagramEntry}
              onNewDiagram={handleNewDiagram}
            />
          </div>
        </div>
      )}


      <div className="container mx-auto p-6 max-w-6xl flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">🔧 Generador IA</h1>
            <p className="text-gray-600">Analiza, diagrama y genera código con inteligencia artificial</p>
            {currentEntry && (
              <div className="text-sm text-info mt-1">
                📚 Mostrando entrada del historial: {new Date(currentEntry.timestamp).toLocaleString('es-ES')}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="btn btn-outline btn-sm"
              title="Ver historial de consultas lógicas"
            >
              📚 Historial
            </button>
            <button
              onClick={() => setShowDiagramHistory(true)}
              className="btn btn-outline btn-sm"
            >
              📊 Historial Diagramas
            </button>


            <button
              onClick={handleNewLogic}
              className="btn btn-outline btn-sm"
              disabled={!inputText && !logicResult && !diagramResult}
            >
              🗑️ Limpiar
            </button>
            <a href="/dashboard" className="btn btn-ghost btn-sm">
              ← Volver
            </a>
          </div>
        </div>

        {/* Pestañas de modo */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeMode === 'statement' ? 'tab-active' : ''}`}
            onClick={() => setActiveMode('statement')}
          >
            📝 Análisis
          </button>
          <button
            className={`tab ${activeMode === 'diagram' ? 'tab-active' : ''}`}
            onClick={() => setActiveMode('diagram')}
          >
            📊 Diagrama
          </button>
          <button
            className={`tab ${activeMode === 'code' ? 'tab-active' : ''}`}
            onClick={() => setActiveMode('code')}
          >
            💻 Código
          </button>
        </div>

        {/* Área de input */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <h2 className="card-title">
              {activeMode === 'statement' && '📝 Describe el problema lógico'}
              {activeMode === 'diagram' && '📊 Describe el algoritmo para el diagrama'}
              {activeMode === 'code' && '💻 Describe el problema para generar código'}
            </h2>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeMode === 'statement' ? 'Ej: Tengo 3 cajas, una contiene solo manzanas...' :
                  activeMode === 'diagram' ? 'Ej: Algoritmo para ordenar una lista de números...' :
                    'Ej: Crear una función que calcule el factorial de un número...'
              }
              className="textarea textarea-bordered w-full h-32 mb-4"
              disabled={isLoading}
            />

            <div className="card-actions justify-end">
              <button
                onClick={handleGenerate}
                disabled={!inputText.trim() || isLoading}
                className="btn btn-primary"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Generando...
                  </>
                ) : (
                  <>
                    ✨ Generar {activeMode === 'statement' ? 'Análisis' : activeMode === 'diagram' ? 'Diagrama' : 'Código'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Área de resultados */}
        {/* Generador de diagramas de flujo */}
        {activeMode === 'diagram' && diagramResult && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">📊 Diagrama de Flujo</h2>
                {currentDiagramEntry && (
                  <span className="badge badge-outline">
                    📅 {new Date(currentDiagramEntry.timestamp).toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>
              <MermaidViewer chart={diagramResult.mermaid} />
            </div>
          </div>
        )}

        {/* Analisis y codigo */}
        {(activeMode === 'statement' || activeMode === 'code') && logicResult && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">
                  {activeMode === 'statement' ? '📝 Análisis Lógico' : '💻 Código Generado'}
                </h2>
                {currentEntry && (
                  <div className="flex gap-2">
                    <span className={`badge ${currentEntry.nivel === 'fácil' ? 'badge-success' :
                      currentEntry.nivel === 'medio' ? 'badge-warning' : 'badge-error'
                      }`}>
                      {currentEntry.nivel}
                    </span>
                    <span className="badge badge-outline">{currentEntry.tipo}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {activeMode === 'code' ? (
                  // CÓDIGO: Usar CodeViewer con colores
                  <div>
                    <h3 className="font-bold mb-2">Código:</h3>
                    <CodeViewer
                      code={logicResult.respuesta}
                      title="Solución generada"
                    />
                  </div>
                ) : (
                  // ANÁLISIS: Mostrar texto normal
                  <div>
                    <h3 className="font-bold mb-2">Respuesta:</h3>
                    <div className="bg-base-200 p-4 rounded">
                      <pre className="whitespace-pre-wrap">{logicResult.respuesta}</pre>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-bold mb-2">Explicación:</h3>
                  <div className="bg-base-200 p-4 rounded">
                    <p className="whitespace-pre-wrap">{logicResult.explicacion}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="badge badge-primary">{logicResult.tipo}</span>
                  <span className="badge badge-secondary">{logicResult.nivel}</span>
                  {currentEntry && (
                    <span className="badge badge-outline">
                      📅 {new Date(currentEntry.timestamp).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;