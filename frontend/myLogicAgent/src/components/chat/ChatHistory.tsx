import { useState, useEffect } from 'react';
import { chatService } from '../../services';
import type { ChatSessionSummary } from '../../types/chat';
import toast from 'react-hot-toast';

interface ChatHistoryProps {
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

const ChatHistory = ({ currentSessionId, onSelectSession, onNewChat }: ChatHistoryProps) => {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await chatService.getAllSessions();
      setSessions(data);
    } catch (error) {
      toast.error('Error cargando historial');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <span className="loading loading-spinner loading-sm"></span>
      </div>
    );
  }

  return (
    <div className="w-64 bg-base-200 h-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">💬 Historial</h3>
        <button 
          onClick={onNewChat}
          className="btn btn-primary btn-sm"
          title="Nueva conversación"
        >
          ➕
        </button>
      </div>

      {/* Lista de sesiones */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">💬</div>
            <p className="text-sm">No hay conversaciones</p>
            <button 
              onClick={onNewChat}
              className="btn btn-primary btn-sm mt-2"
            >
              Empezar chat
            </button>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.sessionId}
              onClick={() => onSelectSession(session.sessionId)}
              className={`
                card bg-base-100 p-3 cursor-pointer transition-all hover:bg-base-300
                ${currentSessionId === session.sessionId ? 'ring-2 ring-primary' : ''}
              `}
            >
              <h4 className="font-medium text-sm truncate mb-1">
                {session.title}
              </h4>
              <p className="text-xs text-gray-500">
                {new Date(session.lastActivity).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHistory;