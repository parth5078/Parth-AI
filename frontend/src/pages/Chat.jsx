import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI } from '../services/api';
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

  const loadChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setChats(response.data);
    } catch (error) {
      toast.error('Failed to load chats');
    }
  };

  const loadChat = async (chatId) => {
    try {
      const response = await chatAPI.getChat(chatId);
      setCurrentChat(response.data);
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const createNewChat = async () => {
    try {
      const response = await chatAPI.createChat({
        title: 'New Chat',
        model: selectedModel,
        language: user?.preferences?.language || 'english'
      });
      setCurrentChat(response.data);
      loadChats();
    } catch (error) {
      toast.error('Failed to create chat');
    }
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      await chatAPI.deleteChat(chatId);
      if (currentChat?._id === chatId) {
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
      const response = await chatAPI.sendMessage({
        chatId: currentChat?._id,
        message: userMessage,
        model: selectedModel,
        language: user?.preferences?.language || 'english'
      });

      setCurrentChat(response.data.chat);
      loadChats();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Something went wrong');
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
        currentChatId={currentChat?._id}
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
