import { useState } from 'react';
import { Search, Bell, Menu, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

export default function TopNavbar({ title, onMenuToggle, sidebarOpen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { user } = useAuth();

  const notifications = [
    { id: 1, message: 'New feature available: AI Models', time: '2 hours ago' },
    { id: 2, message: 'Your usage report is ready', time: '1 day ago' },
  ];

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-text-muted hover:text-white"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden lg:block">
          <Logo size="small" />
        </div>

        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-white">{title || 'ParthAI'}</h1>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations, messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-text-muted hover:text-white"
          title="Toggle theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-text-muted hover:text-white relative"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card shadow-glow-sm animate-slide-up">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-text-muted text-sm">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <p className="text-sm text-white mb-1">{notif.message}</p>
                      <p className="text-xs text-text-muted">{notif.time}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-semibold shadow-glow-sm">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <ChevronDown size={16} className="text-text-muted" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-card shadow-glow-sm animate-slide-up">
              <div className="p-4 border-b border-white/10">
                <p className="font-semibold text-white">{user?.username}</p>
                <p className="text-sm text-text-muted truncate">{user?.email}</p>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-text-muted hover:bg-white/5 hover:text-white rounded-lg transition-colors text-left">
                  <User size={16} />
                  <span className="text-sm">Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-text-muted hover:bg-white/5 hover:text-white rounded-lg transition-colors text-left">
                  <Bell size={16} />
                  <span className="text-sm">Notifications</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
