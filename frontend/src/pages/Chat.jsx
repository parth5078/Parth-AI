import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getChats, saveChat, getChatById, deleteChat as deleteChatStorage } from '../services/localStorage';
import axios from 'axios';
import { Send, Plus, Trash2, Settings, LogOut, MessageSquare, Sparkles, Bot } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ChatSidebar from '../components/ChatSidebar';
import TopNavbar from '../components/TopNavbar';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import StatsCards from '../components/StatsCards';
import ModelSelector from '../components/ModelSelector';
import Logo from '../components/Logo';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChats = () => {
    try {
      const userChats = getChats(user?.id);
      setChats(userChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (error) {
      toast.error('Failed to load chats');
    }
  };

  const loadChat = (chatId) => {
    try {
      const chat = getChatById(chatId, user?.id);
      if (chat) {
        setCurrentChat(chat);
      } else {
        toast.error('Chat not found');
      }
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const createNewChat = () => {
    try {
      const newChat = {
        id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2),
        userId: user?.id,
        title: 'New Chat',
        model: selectedModel,
        language: user?.preferences?.language || 'english',
        messages: []
      };
      saveChat(newChat);
      setCurrentChat(newChat);
      loadChats();
    } catch (error) {
      toast.error('Failed to create chat');
    }
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    try {
      deleteChatStorage(chatId, user?.id);
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
      loadChats();
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const sendMessage = async (msg, uploadedFiles = []) => {
    if ((!msg.trim() && uploadedFiles.length === 0) || loading) return;

    const userMessage = msg;
    setMessage('');
    setLoading(true);

    try {
      let chat = currentChat;
      
      if (!chat) {
        chat = {
          id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2),
          userId: user?.id,
          title: userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : 'New Chat'),
          model: selectedModel,
          language: user?.preferences?.language || 'english',
          messages: []
        };
      }

      const userMessageContent = {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      };

      // Add files to message if present
      if (uploadedFiles.length > 0) {
        userMessageContent.files = uploadedFiles;
      }

      const updatedChat = {
        ...chat,
        messages: [...(chat.messages || []), userMessageContent]
      };

      setCurrentChat(updatedChat);

      const getSystemPrompt = (language) => {
        const languagePrompts = {
          english: `You are ParthAI.

Rules:
- Introduce yourself as ParthAI when asked.
- Be friendly and professional.
- Help with coding, internships, careers, AI, web development and general questions.
- Use simple English.
- Use bullet points when helpful.
- Avoid HTML tags.
- Avoid markdown tables.
- Give clean and readable answers.`,
          gujarati: `You are ParthAI.

Rules:
- Introduce yourself as ParthAI when asked.
- Be friendly and professional.
- Help with coding, internships, careers, AI, web development and general questions.
- Respond in Gujarati when the user speaks Gujarati.
- Use bullet points when helpful.
- Avoid HTML tags.
- Avoid markdown tables.
- Give clean and readable answers.`,
          hindi: `You are ParthAI.

Rules:
- Introduce yourself as ParthAI when asked.
- Be friendly and professional.
- Help with coding, internships, careers, AI, web development and general questions.
- Respond in Hindi when the user speaks Hindi.
- Use bullet points when helpful.
- Avoid HTML tags.
- Avoid markdown tables.
- Give clean and readable answers.`
        };
        
        return languagePrompts[language] || languagePrompts.english;
      };

      // Check for image generation command
      const imageGenRegex = /^(generate image|create image|draw|paint|make an image|image:)/i;
      const isImageGeneration = imageGenRegex.test(userMessage);

      let aiResponse;

      if (isImageGeneration) {
        // Extract the prompt for image generation
        const imagePrompt = userMessage.replace(imageGenRegex, '').trim() || userMessage;
        
        try {
          // Use a free image generation API (Pollinations.ai)
          const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&nologo=true`;
          
          aiResponse = `I've generated an image based on your request: "${imagePrompt}"\n\n![Generated Image](${imageUrl})`;
        } catch (imgError) {
          console.error('Image generation error:', imgError);
          aiResponse = 'Sorry, I encountered an error generating the image. Please try again.';
        }
      } else {
        // Regular chat with OpenRouter
        const messagesToSend = updatedChat.messages.map(msg => {
          let content = msg.content;
          // Add file information to the message
          if (msg.files && msg.files.length > 0) {
            const fileNames = msg.files.map(f => f.name).join(', ');
            content += `\n\n[Attached files: ${fileNames}]`;
          }
          return {
            role: msg.role,
            content: content
          };
        });

        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: updatedChat.model,
            messages: [
              {
                role: 'system',
                content: getSystemPrompt(updatedChat.language)
              },
              ...messagesToSend
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'ParthAI'
            }
          }
        );

        aiResponse = response.data.choices[0].message.content;
      }

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString()
        }]
      };

      saveChat(finalChat);
      setCurrentChat(finalChat);
      loadChats();
    } catch (error) {
      console.error('OpenRouter Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  const suggestions = [
    { icon: Sparkles, text: 'Help me write code' },
    { icon: Bot, text: 'Explain a concept' },
    { icon: MessageSquare, text: 'Start a conversation' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        currentChatId={currentChat?.id}
        onChatSelect={loadChat}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          title={currentChat?.title || 'ParthAI'}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats Cards - Only show when no chat is selected */}
          {!currentChat && (
            <div className="p-6 lg:p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 animate-fade-in">
                  <Logo size="large" className="mx-auto mb-6" />
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                    Welcome to <span className="gradient-text">ParthAI</span>
                  </h1>
                  <p className="text-lg text-text-muted max-w-2xl mx-auto">
                    Your intelligent AI assistant for coding, learning, and productivity. Start a conversation to explore the possibilities.
                  </p>
                </div>

                <StatsCards />

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Quick Start</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setMessage(suggestion.text);
                          createNewChat();
                        }}
                        className="glass-card p-5 hover:border-primary/30 transition-all duration-300 text-left group"
                      >
                        <suggestion.icon size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                        <p className="text-white font-medium">{suggestion.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {currentChat && (
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
              {currentChat.messages?.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  isUser={msg.role === 'user'}
                />
              ))}
              {loading && (
                <div className="flex gap-4 p-6 animate-fade-in">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-glow-sm">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-semibold text-white">ParthAI</span>
                    </div>
                    <div className="glass-card px-4 py-3 inline-flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Model Selector - Only show when chat is selected */}
          {currentChat && (
            <div className="px-6 pb-4">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>
          )}

          {/* Input */}
          <ChatInput
            onSendMessage={sendMessage}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
