import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getChats } from '../services/localStorage';
import { BarChart3, MessageSquare, Clock, TrendingUp, Calendar, Activity } from 'lucide-react';
import ChatSidebar from '../components/ChatSidebar';
import TopNavbar from '../components/TopNavbar';

export default function Analytics() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalChats: 0,
    totalMessages: 0,
    avgMessagesPerChat: 0,
    mostActiveDay: '',
    weeklyActivity: [],
    modelUsage: {}
  });

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = () => {
    const chats = getChats(user?.id);
    const totalMessages = chats.reduce((acc, chat) => acc + (chat.messages?.length || 0), 0);
    const avgMessagesPerChat = chats.length > 0 ? (totalMessages / chats.length).toFixed(1) : 0;

    // Calculate model usage
    const modelUsage = {};
    chats.forEach(chat => {
      const model = chat.model || 'unknown';
      modelUsage[model] = (modelUsage[model] || 0) + 1;
    });

    // Calculate weekly activity (last 7 days)
    const weeklyActivity = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      const dateStr = date.toISOString().split('T')[0];
      
      const chatsOnDay = chats.filter(chat => {
        const chatDate = new Date(chat.updatedAt).toISOString().split('T')[0];
        return chatDate === dateStr;
      }).length;

      weeklyActivity.push({ day: dayName, date: dateStr, count: chatsOnDay });
    }

    // Find most active day
    const dayCounts = {};
    chats.forEach(chat => {
      const day = new Date(chat.updatedAt).toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const mostActiveDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    setAnalytics({
      totalChats: chats.length,
      totalMessages,
      avgMessagesPerChat,
      mostActiveDay,
      weeklyActivity,
      modelUsage
    });
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
    <div className="glass-card p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-xl bg-${color}/10`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
        <div>
          <p className="text-text-muted text-sm">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
      </div>
      {subtitle && (
        <p className="text-sm text-text-muted">{subtitle}</p>
      )}
    </div>
  );

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
          title="Analytics"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Analytics Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                <span className="gradient-text">Analytics</span>
              </h1>
              <p className="text-lg text-text-muted">
                Track your usage patterns and activity
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={MessageSquare}
                title="Total Chats"
                value={analytics.totalChats}
                subtitle="All conversations"
              />
              <StatCard
                icon={Activity}
                title="Total Messages"
                value={analytics.totalMessages}
                subtitle="Messages exchanged"
                color="emerald"
              />
              <StatCard
                icon={TrendingUp}
                title="Avg Messages/Chat"
                value={analytics.avgMessagesPerChat}
                subtitle="Conversation depth"
                color="purple"
              />
              <StatCard
                icon={Calendar}
                title="Most Active Day"
                value={analytics.mostActiveDay}
                subtitle="Peak activity"
                color="blue"
              />
            </div>

            {/* Weekly Activity Chart */}
            <div className="glass-card p-6 mb-8 animate-slide-up delay-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BarChart3 size={24} className="text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-white">Weekly Activity</h2>
              </div>
              
              <div className="flex items-end justify-between gap-4 h-48">
                {analytics.weeklyActivity.map((day, index) => {
                  const maxCount = Math.max(...analytics.weeklyActivity.map(d => d.count), 1);
                  const height = (day.count / maxCount) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-white/5 rounded-t-lg relative" style={{ height: '100%' }}>
                        <div
                          className="absolute bottom-0 w-full gradient-primary rounded-t-lg transition-all duration-500"
                          style={{ height: `${Math.max(height, 5)}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{day.count}</p>
                        <p className="text-xs text-text-muted">{day.day}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Model Usage */}
            <div className="glass-card p-6 animate-slide-up delay-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Activity size={24} className="text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Model Usage</h2>
              </div>
              
              <div className="space-y-4">
                {Object.entries(analytics.modelUsage).length === 0 ? (
                  <p className="text-text-muted">No model usage data yet</p>
                ) : (
                  Object.entries(analytics.modelUsage).map(([model, count], index) => {
                    const maxCount = Math.max(...Object.values(analytics.modelUsage));
                    const percentage = (count / maxCount) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white truncate flex-1">{model}</span>
                          <span className="text-sm text-text-muted ml-4">{count} chats</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <div
                            className="gradient-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Activity Summary */}
            <div className="glass-card p-6 mt-8 animate-slide-up delay-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Clock size={24} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Activity Summary</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <p className="text-3xl font-bold text-white mb-1">{analytics.totalChats}</p>
                  <p className="text-sm text-text-muted">Total Conversations</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <p className="text-3xl font-bold text-white mb-1">{analytics.totalMessages}</p>
                  <p className="text-sm text-text-muted">Messages Sent</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <p className="text-3xl font-bold text-white mb-1">{analytics.avgMessagesPerChat}</p>
                  <p className="text-sm text-text-muted">Avg. per Chat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
