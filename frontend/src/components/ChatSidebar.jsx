import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Settings, LogOut, MessageSquare, LayoutDashboard, BarChart3, Cpu, Bell, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getChats, saveChat, deleteChat as deleteChatStorage } from '../services/localStorage';
import toast from 'react-hot-toast';
import Logo from './Logo';

export default function ChatSidebar({ currentChatId, onChatSelect, isOpen, onToggle }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('conversations');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = () => {
    try {
      const userChats = getChats(user?.id);
      setChats(userChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    try {
      const newChat = {
        id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2),
        userId: user?.id,
        title: 'New Chat',
        model: user?.preferences?.model || 'openai/gpt-oss-120b:free',
        language: user?.preferences?.language || 'english',
        messages: []
      };
      saveChat(newChat);
      onChatSelect(newChat.id);
      loadChats();
      setActiveMenu('conversations');
      toast.success('New chat created');
    } catch (error) {
      toast.error('Failed to create new chat');
    }
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    try {
      deleteChatStorage(chatId, user?.id);
      toast.success('Chat deleted');
      loadChats();
      if (currentChatId === chatId) {
        onChatSelect(null);
      }
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'models', label: 'AI Models', icon: Cpu, path: '/models' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 lg:z-auto
        w-72 h-full
        glass-dark
        flex flex-col
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
      `}>
        {/* Logo Section */}
        <div className="p-4 border-b border-white/10">
          <Logo size="large" />
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 gradient-primary text-white rounded-xl hover:opacity-90 transition-all shadow-glow-sm hover:shadow-glow"
          >
            <Plus size={20} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 mb-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  if (item.path) navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeMenu === item.id
                    ? 'gradient-primary text-white shadow-glow-sm'
                    : 'text-text-muted hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Chat History */}
        {activeMenu === 'conversations' && (
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase mb-3 px-2">Recent Chats</h3>
            
            {loading ? (
              <div className="text-text-muted text-sm px-2">Loading chats...</div>
            ) : chats.length === 0 ? (
              <div className="text-text-muted text-sm px-2">No chats yet</div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => onChatSelect(chat.id)}
                    className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                      currentChatId === chat.id
                        ? 'bg-primary/20 text-white border border-primary/30'
                        : 'hover:bg-white/5 text-text-muted hover:text-white'
                    }`}
                  >
                    <MessageSquare size={16} />
                    <span className="flex-1 truncate text-sm">{chat.title}</span>
                    <button
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="flex items-center gap-3 px-3 py-3 glass-card">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold shadow-glow-sm">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.username}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-text-muted hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
