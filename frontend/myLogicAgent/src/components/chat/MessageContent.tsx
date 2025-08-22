import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

const MessageContent = ({ content, isUser }: MessageContentProps) => {
  const [copiedCode, setCopiedCode] = useState<string>('');

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Código copiado');
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  // Para mensajes del usuario, mostrar texto simple
  if (isUser) {
    return (
      <span className="whitespace-pre-wrap">
        {content}
      </span>
    );
  }

  // Para mensajes de IA, renderizar Markdown
  return (
    <div className="prose prose-sm max-w-none prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Personalizar código inline
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && match) {
              // Bloque de código con syntax highlighting
              return (
                <div className="relative my-4">
                  <div className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-t-lg">
                    <span className="text-sm text-gray-300">{language}</span>
                    <button
                      onClick={() => copyCode(codeString)}
                      className="text-xs text-gray-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedCode === codeString ? (
                        <>✅ Copiado</>
                      ) : (
                        <>📋 Copiar</>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: '0.5rem',
                      borderBottomRightRadius: '0.5rem'
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // Código inline
            return (
              <code 
                className="bg-gray-700 text-gray-100 px-1 py-0.5 rounded text-sm font-mono" 
                {...props}
              >
                {children}
              </code>
            );
          },

          // Personalizar párrafos
          p({ children }) {
            return <p className="mb-3 leading-relaxed text-white">{children}</p>;
          },

          // Personalizar listas
          ul({ children }) {
            return <ul className="list-disc list-inside mb-3 space-y-1 text-white">{children}</ul>;
          },

          ol({ children }) {
            return <ol className="list-decimal list-inside mb-3 space-y-1 text-white">{children}</ol>;
          },

          // Personalizar enlaces
          a({ href, children }) {
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {children}
              </a>
            );
          },

          // Personalizar headers
          h1({ children }) {
            return <h1 className="text-xl font-bold mb-3 text-white">{children}</h1>;
          },
          
          h2({ children }) {
            return <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>;
          },

          h3({ children }) {
            return <h3 className="text-md font-bold mb-2 text-white">{children}</h3>;
          },

          // Personalizar blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-blue-400 pl-4 my-3 italic text-gray-300">
                {children}
              </blockquote>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageContent;