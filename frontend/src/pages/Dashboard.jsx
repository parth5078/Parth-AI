import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getChats } from '../services/localStorage';
import { MessageSquare, Clock, TrendingUp, Zap, Plus, ArrowRight } from 'lucide-react';
import ChatSidebar from '../components/ChatSidebar';
import TopNavbar from '../components/TopNavbar';
import Logo from '../components/Logo';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalChats: 0,
    totalMessages: 0,
    recentChats: 0
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = () => {
    const chats = getChats(user?.id);
    const totalMessages = chats.reduce((acc, chat) => acc + (chat.messages?.length || 0), 0);
    const now = new Date();
    const recentChats = chats.filter(chat => {
      const chatDate = new Date(chat.updatedAt);
      const diffDays = (now - chatDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).length;

    setStats({
      totalChats: chats.length,
      totalMessages,
      recentChats
    });
  };

  const quickActions = [
    {
      icon: Plus,
      title: 'New Chat',
      description: 'Start a fresh conversation',
      action: () => navigate('/chat')
    },
    {
      icon: MessageSquare,
      title: 'View Conversations',
      description: 'Browse your chat history',
      action: () => navigate('/chat')
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'View usage statistics',
      action: () => navigate('/analytics')
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ChatSidebar
        currentChatId={null}
        onChatSelect={() => {}}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          title="Dashboard"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                Welcome back, <span className="gradient-text">{user?.username || 'User'}</span>
              </h1>
              <p className="text-lg text-text-muted">
                Here's an overview of your activity
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 animate-slide-up delay-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <MessageSquare size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Total Chats</p>
                    <p className="text-3xl font-bold text-white">{stats.totalChats}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <TrendingUp size={16} className="text-emerald-400" />
                  <span>All time conversations</span>
                </div>
              </div>

              <div className="glass-card p-6 animate-slide-up delay-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <Zap size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Total Messages</p>
                    <p className="text-3xl font-bold text-white">{stats.totalMessages}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Clock size={16} className="text-primary" />
                  <span>Messages exchanged</span>
                </div>
              </div>

              <div className="glass-card p-6 animate-slide-up delay-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Clock size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm">Recent Activity</p>
                    <p className="text-3xl font-bold text-white">{stats.recentChats}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <span>Last 7 days</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="glass-card p-6 hover:border-primary/30 transition-all duration-300 text-left group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <action.icon size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{action.title}</h3>
                        <p className="text-sm text-text-muted">{action.description}</p>
                      </div>
                      <ArrowRight size={20} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Welcome Section */}
            <div className="glass-card p-8 animate-slide-up">
              <div className="flex items-start gap-6">
                <div className="hidden lg:block">
                  <Logo size="large" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-3">Get Started with ParthAI</h2>
                  <p className="text-text-muted mb-4">
                    ParthAI is your intelligent assistant for coding, learning, and productivity. 
                    Start a new conversation to explore its capabilities.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate('/chat')}
                      className="flex items-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-glow-sm hover:shadow-glow"
                    >
                      <Plus size={20} />
                      Start New Chat
                    </button>
                    <button
                      onClick={() => navigate('/settings')}
                      className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                    >
                      Configure Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
