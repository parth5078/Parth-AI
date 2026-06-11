import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Settings, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile({
      username: formData.username,
      avatar: formData.avatar
    });

    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.error);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-dark border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="medium" />
          <button
            onClick={() => navigate('/chat')}
            className="text-text-muted hover:text-white transition-colors"
          >
            Back to Chat
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-text-muted">Manage your account settings and preferences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.username}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl gradient-primary flex items-center justify-center text-white text-4xl font-bold shadow-glow-sm">
                    {formData.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                  <Camera size={16} />
                </button>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{formData.username}</h3>
              <p className="text-text-muted text-sm">{formData.email}</p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="glass-card p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-text-muted mb-2">
                    <User size={16} />
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    placeholder="Enter your username"
                    required
                    minLength={3}
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-text-muted mb-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-text-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-text-muted mb-2">
                    <Camera size={16} />
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm hover:shadow-glow"
                  >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Info */}
            <div className="glass-card p-6 rounded-2xl mt-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Settings size={18} />
                Account Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Member Since</span>
                  <span className="text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Account ID</span>
                  <span className="text-white font-mono text-xs">{user.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
