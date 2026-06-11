import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, User, Bot, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

export default function ChatMessage({ message, isUser }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex gap-4 p-6 ${isUser ? 'bg-white/5' : 'bg-transparent'} animate-fade-in`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-glow-sm ${
        isUser 
          ? 'gradient-primary' 
          : 'bg-gradient-to-br from-emerald-500 to-teal-500'
      }`}>
        {isUser ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-semibold text-white">
            {isUser ? 'You' : 'ParthAI'}
          </span>
          <span className="text-xs text-text-muted">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
        </div>

        {/* Display attached files */}
        {message.files && message.files.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {message.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
              >
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.data}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText size={24} className="text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-text-muted">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadFile(file)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Download"
                >
                  <Download size={16} className="text-text-muted" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative group my-4">
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        title="Copy code"
                      >
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white" />}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl !bg-background-card/80 !border !border-white/10"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-white/10 px-2 py-1 rounded-lg text-sm border border-white/10" {...props}>
                    {children}
                  </code>
                );
              },
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="rounded-xl max-w-full h-auto my-4 border border-white/10"
                />
              ),
              p: ({ children }) => <p className="text-text-muted mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside text-text-muted mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside text-text-muted mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-4 mt-5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-4 mt-4">{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/50 pl-4 italic text-text-muted mb-4 bg-white/5 py-2 rounded-r-lg">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-primary-light hover:text-primary hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
