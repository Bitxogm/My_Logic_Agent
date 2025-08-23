import { useState } from 'react';
import { chatService, agentService } from '../../services';
import toast from 'react-hot-toast';
import type { ChatMessage } from '../../types/chat';

interface MessageActionsProps {
  message: ChatMessage;
  sessionId: string;
  onNewMessage: (message: ChatMessage) => void;
  onShowDiagram: (mermaidCode: string) => void;
}

const MessageActions = ({ 
  message, 
  sessionId, 
  onNewMessage, 
  onShowDiagram 
}: MessageActionsProps) => {
  const [isLoading, setIsLoading] = useState<string>(''); // Qué acción está cargando

  // Solo mostrar acciones para mensajes del asistente
  if (message.role === 'user') return null;

  const handleRegenerate = async () => {
    setIsLoading('regenerate');
    try {
      // Buscar el último mensaje del usuario antes de este
      const lastUserMessage = "Regenera tu respuesta anterior con un enfoque diferente";
      
      const response = await chatService.sendMessage({
        message: lastUserMessage,
        sessionId,
        context: 'Regeneración de respuesta anterior'
      });

      const newMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      onNewMessage(newMessage);
      toast.success('Respuesta regenerada');
    } catch (error) {
      toast.error('Error al regenerar respuesta');
    } finally {
      setIsLoading('');
    }
  };

  const handleExplainMore = async () => {
    setIsLoading('explain');
    try {
      const response = await chatService.sendMessage({
        message: "Puedes explicar el tema anterior con más detalle y ejemplos adicionales?",
        sessionId,
        context: 'Solicitud de explicación detallada'
      });

      const newMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      onNewMessage(newMessage);
      toast.success('Explicación detallada generada');
    } catch (error) {
      toast.error('Error al generar explicación');
    } finally {
      setIsLoading('');
    }
  };

  const handleOptimizeCode = async () => {
    setIsLoading('optimize');
    try {
      const response = await agentService.solveLogic({
        modo: 'code',
        enunciado: `Optimiza y mejora este código: ${message.content}`
      });

      const newMessage: ChatMessage = {
        role: 'assistant',
        content: `## 🚀 Versión Optimizada:\n\n${response.respuesta}\n\n## 📝 Explicación de mejoras:\n\n${response.explicacion}`,
        timestamp: new Date().toISOString()
      };

      onNewMessage(newMessage);
      toast.success('Código optimizado');
    } catch (error) {
      toast.error('Error al optimizar código');
    } finally {
      setIsLoading('');
    }
  };

  const handleCreateDiagram = async () => {
    setIsLoading('diagram');
    try {
      const response = await agentService.generateDiagram({
        enunciado: `Crea un diagrama de flujo basado en: ${message.content.substring(0, 200)}...`
      });

      onShowDiagram(response.mermaid);
      toast.success('Diagrama generado');
    } catch (error) {
      toast.error('Error al generar diagrama');
    } finally {
      setIsLoading('');
    }
  };

  // Detectar si el mensaje contiene código
  const hasCode = message.content.includes('```') || 
                  message.content.includes('def ') || 
                  message.content.includes('function') ||
                  message.content.includes('class ') ||
                  message.content.includes('import ');

  return (
    <div className="flex flex-wrap gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
      
      {/* Regenerar */}
      <button
        onClick={handleRegenerate}
        disabled={isLoading === 'regenerate'}
        className="btn btn-ghost btn-xs"
        title="Generar una respuesta diferente"
      >
        {isLoading === 'regenerate' ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          '🔄'
        )}
        Regenerar
      </button>

      {/* Explicar más */}
      <button
        onClick={handleExplainMore}
        disabled={isLoading === 'explain'}
        className="btn btn-ghost btn-xs"
        title="Explicación más detallada"
      >
        {isLoading === 'explain' ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          '📝'
        )}
        Explicar más
      </button>

      {/* Optimizar código (solo si hay código) */}
      {hasCode && (
        <button
          onClick={handleOptimizeCode}
          disabled={isLoading === 'optimize'}
          className="btn btn-ghost btn-xs"
          title="Optimizar el código mostrado"
        >
          {isLoading === 'optimize' ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            '🚀'
          )}
          Optimizar
        </button>
      )}

      {/* Crear diagrama */}
      <button
        onClick={handleCreateDiagram}
        disabled={isLoading === 'diagram'}
        className="btn btn-ghost btn-xs"
        title="Crear diagrama de flujo"
      >
        {isLoading === 'diagram' ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          '📊'
        )}
        Diagrama
      </button>
    </div>
  );
};

export default MessageActions;