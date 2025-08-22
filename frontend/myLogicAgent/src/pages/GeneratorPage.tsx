import { useState } from 'react';
import { agentService } from '../services';
import toast from 'react-hot-toast';
import type { LogicRequest, LogicResponse, DiagramResponse } from '../types/agent';
import MermaidViewer from '../components/MermaidViewer';
import CodeViewer from '../components/CodeViewer';

const GeneratorPage = () => {
  // Estados para los 3 modos
  const [activeMode, setActiveMode] = useState<'statement' | 'diagram' | 'code'>('statement');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados para resultados
  const [logicResult, setLogicResult] = useState<LogicResponse | null>(null);
  const [diagramResult, setDiagramResult] = useState<DiagramResponse | null>(null);

  // Función para procesar según el modo activo
  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error('Por favor, introduce un enunciado');
      return;
    }

    setIsLoading(true);

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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">🔧 Generador IA</h1>
          <p className="text-gray-600">Analiza, diagrama y genera código con inteligencia artificial</p>
        </div>
        <a href="/dashboard" className="btn btn-ghost btn-sm">
          ← Volver
        </a>
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
      {/* Generador de diagramas de  flujo */}
      {activeMode === 'diagram' && diagramResult && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">📊 Diagrama de Flujo</h2>
            <MermaidViewer chart={diagramResult.mermaid} />
          </div>
        </div>
      )}


      {/* Analisis y codigo */}
      {(activeMode === 'statement' || activeMode === 'code') && logicResult && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">
              {activeMode === 'statement' ? '📝 Análisis Lógico' : '💻 Código Generado'}
            </h2>

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
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GeneratorPage;