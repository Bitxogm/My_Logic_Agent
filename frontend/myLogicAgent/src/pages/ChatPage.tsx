import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services';
import type { ChatMessage } from '../types/chat';
import MessageContent from '../components/chat/MessageContent';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    // Añadir mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        message: inputMessage,
        sessionId: sessionId || undefined,
        context: 'Ejercicios de programación y lógica'
      });

      // Guardar sessionId si es nuevo
      if (!sessionId) {
        setSessionId(response.sessionId);
      }

      // Añadir respuesta de la IA
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      toast.success('Respuesta recibida');

    } catch (error) {
      toast.error('Error al enviar mensaje');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar conversación
  const handleClearChat = async () => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    try {
      await chatService.clearSession(sessionId);
      setMessages([]);
      setSessionId('');
      toast.success('Conversación limpiada');
    } catch (error) {
      toast.error('Error al limpiar conversación');
    }
  };

  // Manejar Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">💬 Chat con IA</h1>
          <p className="text-gray-600">Tu tutor personal de programación</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearChat}
            className="btn btn-outline btn-sm"
            disabled={messages.length === 0}
          >
            🗑️ Limpiar
          </button>
          <a href="/dashboard" className="btn btn-ghost btn-sm">
            ← Volver
          </a>
        </div>
      </div>

      {/* Chat Container */}
      <div className="card bg-base-100 shadow-lg h-[600px] flex flex-col">

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">¡Hola! Soy tu tutor de IA</h3>
              <p className="text-gray-600 mb-4">
                Puedo ayudarte con ejercicios de programación, explicar algoritmos,
                generar código y resolver dudas de lógica.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setInputMessage('Explícame el algoritmo FizzBuzz')}
                  className="btn btn-outline btn-sm"
                >
                  FizzBuzz
                </button>
                <button
                  onClick={() => setInputMessage('¿Cómo funciona el ordenamiento burbuja?')}
                  className="btn btn-outline btn-sm"
                >
                  Ordenamiento
                </button>
                <button
                  onClick={() => setInputMessage('Ayúdame con recursividad')}
                  className="btn btn-outline btn-sm"
                >
                  Recursividad
                </button>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    {message.role === 'user' ? (
                      <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center">
                        👤
                      </div>
                    ) : (
                      <div className="bg-secondary text-white w-10 h-10 rounded-full flex items-center justify-center">
                        🤖
                      </div>
                    )}
                  </div>
                </div>
                <div className="chat-header">
                  {message.role === 'user' ? 'Tú' : 'IA Tutor'}
                  <time className="text-xs opacity-50 ml-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </time>
                </div>
                <div
                  className={`chat-bubble ${message.role === 'user'
                      ? 'chat-bubble-primary'
                      : 'chat-bubble-secondary'
                    }`}
                >
                  <MessageContent
                    content={message.content}
                    isUser={message.role === 'user'}
                  />
                </div>

              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="bg-secondary text-white w-10 h-10 rounded-full flex items-center justify-center">
                  🤖
                </div>
              </div>
              <div className="chat-bubble chat-bubble-secondary">
                <span className="loading loading-dots loading-sm"></span>
                <span className="ml-2">Pensando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta aquí... (Enter para enviar)"
              className="textarea textarea-bordered flex-1 resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                '📤'
              )}
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            💡 Tip: Puedes preguntar sobre algoritmos, pedir código en diferentes lenguajes,
            o solicitar explicaciones paso a paso.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;