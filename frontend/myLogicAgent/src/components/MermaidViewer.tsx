import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidViewerProps {
  chart: string;
}

const MermaidViewer = ({ chart }: MermaidViewerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configurar Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      }
    });

    const renderChart = async () => {
      if (elementRef.current && chart) {
        try {
          // Limpiar contenido anterior
          elementRef.current.innerHTML = '';
          
          // Generar ID único
          const id = `mermaid-${Date.now()}`;
          
          // Renderizar diagrama
          const { svg } = await mermaid.render(id, chart);
          elementRef.current.innerHTML = svg;
          
        } catch (error) {
          console.error('Error rendering mermaid:', error);
          elementRef.current.innerHTML = `
            <div class="alert alert-error">
              <span>Error al renderizar diagrama</span>
            </div>
          `;
        }
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg border">
        <div ref={elementRef} className="mermaid-container" />
      </div>
      
      {/* Código Mermaid raw (colapsable) */}
      <div className="collapse collapse-arrow mt-4">
        <input type="checkbox" />
        <div className="collapse-title text-sm font-medium">
          📄 Ver código Mermaid
        </div>
        <div className="collapse-content">
          <pre className="bg-base-200 p-4 rounded text-xs overflow-x-auto">
            {chart}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MermaidViewer;