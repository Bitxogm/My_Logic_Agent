import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface CodeViewerProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeViewer = ({ code, language = 'javascript', title }: CodeViewerProps) => {
  const [copied, setCopied] = useState(false);

  // Detectar lenguaje automáticamente si no se especifica
  const detectLanguage = (code: string): string => {
    if (code.includes('def ') || code.includes('import ') || code.includes('print(')) return 'python';
    if (code.includes('function') || code.includes('const') || code.includes('console.log')) return 'javascript';
    if (code.includes('public class') || code.includes('System.out.println')) return 'java';
    if (code.includes('#include') || code.includes('cout')) return 'cpp';
    if (code.includes('<?php')) return 'php';
    return language;
  };

  const detectedLanguage = detectLanguage(code);

  // Función para copiar código
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Código copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar código');
    }
  };

  // Limpiar código (quitar markdown si existe)
  const cleanCode = (rawCode: string): string => {
    return rawCode
      .replace(/```[\w]*\n?/g, '') // Quitar ```python, ```javascript, etc.
      .replace(/```/g, '')         // Quitar ``` finales
      .trim();
  };

  const processedCode = cleanCode(code);

  return (
    <div className="w-full">
      {/* Header con título y botones */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {title && <span className="font-medium">{title}</span>}
          <span className="badge badge-outline badge-sm">
            {detectedLanguage}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="btn btn-sm btn-ghost"
            title="Copiar código"
          >
            {copied ? (
              <>✅ Copiado</>
            ) : (
              <>📋 Copiar</>
            )}
          </button>
        </div>
      </div>

      {/* Editor de código */}
      <div className="rounded-lg overflow-hidden border">
        <SyntaxHighlighter
          language={detectedLanguage}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
          showLineNumbers={true}
          wrapLines={true}
          wrapLongLines={true}
        >
          {processedCode}
        </SyntaxHighlighter>
      </div>

      {/* Footer con info adicional */}
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>{processedCode.split('\n').length} líneas</span>
        <span>{processedCode.length} caracteres</span>
      </div>
    </div>
  );
};

export default CodeViewer;