import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save, User, Palette, Globe, Cpu, Bell, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import ChatSidebar from '../components/ChatSidebar';
import TopNavbar from '../components/TopNavbar';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(user?.username || '');
  const [theme, setTheme] = useState(user?.preferences?.theme || 'dark');
  const [language, setLanguage] = useState(user?.preferences?.language || 'english');
  const [model, setModel] = useState(user?.preferences?.model || 'openai/gpt-oss-120b:free');
  const [notifications, setNotifications] = useState(user?.preferences?.notifications || true);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile({
      username,
      preferences: {
        theme,
        language,
        model,
        notifications
      }
    });

    if (result.success) {
      toast.success('Settings saved successfully');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const models = [
    { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS 120B (Free)', description: 'Free tier model' },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and efficient' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'Most capable model' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', description: 'Lightweight and fast' },
    { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance' },
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
          title="Settings"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Settings
              </h1>
              <p className="text-text-muted">
                Manage your account preferences and AI settings
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Section */}
              <div className="glass-card p-6 animate-slide-up delay-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <User size={24} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Profile</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-muted cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Appearance Section */}
              <div className="glass-card p-6 animate-slide-up delay-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Palette size={24} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Appearance</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-primary bg-primary/10 shadow-glow-sm'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-background-dark border-2 border-white/20" />
                        <span className="text-white font-medium">Dark</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        theme === 'light'
                          ? 'border-primary bg-primary/10 shadow-glow-sm'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border-2 border-gray-300" />
                        <span className="text-white font-medium">Light</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Language Section */}
              <div className="glass-card p-6 animate-slide-up delay-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Globe size={24} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Language</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Response Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  >
                    <option value="english">English</option>
                    <option value="gujarati">Gujarati</option>
                    <option value="hindi">Hindi</option>
                  </select>
                  <p className="text-sm text-text-muted mt-2">
                    Choose the language for AI responses
                  </p>
                </div>
              </div>

              {/* AI Model Section */}
              <div className="glass-card p-6 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Cpu size={24} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">AI Model</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Select AI Model
                  </label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  >
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} - {m.description}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-text-muted mt-2">
                    Choose the AI model for your conversations. Some models may have different capabilities and pricing.
                  </p>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="glass-card p-6 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Bell size={24} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Notifications</h2>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Enable Notifications</p>
                    <p className="text-sm text-text-muted">Receive updates about new features and messages</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      notifications ? 'bg-primary' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 gradient-primary text-white font-semibold rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm hover:shadow-glow"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
