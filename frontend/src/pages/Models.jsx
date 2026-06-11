import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Cpu, Zap, DollarSign, Star, Check, Info, ArrowRight } from 'lucide-react';
import ChatSidebar from '../components/ChatSidebar';
import TopNavbar from '../components/TopNavbar';

export default function Models() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const models = [
    {
      id: 'openai/gpt-oss-120b:free',
      name: 'GPT-OSS 120B',
      provider: 'OpenRouter',
      description: 'Free tier model with good performance for general tasks',
      features: ['Free to use', 'Good for coding', 'Fast responses', 'General purpose'],
      pricing: 'Free',
      speed: 'Fast',
      recommended: true,
      icon: Zap
    },
    {
      id: 'openai/gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      description: 'Compact and efficient model for quick responses',
      features: ['Fast responses', 'Cost-effective', 'Good for simple tasks', 'Low latency'],
      pricing: 'Low cost',
      speed: 'Very Fast',
      recommended: false,
      icon: Star
    },
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      description: 'Most capable model with advanced reasoning',
      features: ['Advanced reasoning', 'Best performance', 'Multimodal', 'Complex tasks'],
      pricing: 'Premium',
      speed: 'Medium',
      recommended: false,
      icon: Cpu
    },
    {
      id: 'anthropic/claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      description: 'Lightweight and fast for quick interactions',
      features: ['Very fast', 'Lightweight', 'Good for summaries', 'Quick answers'],
      pricing: 'Low cost',
      speed: 'Very Fast',
      recommended: false,
      icon: Zap
    },
    {
      id: 'anthropic/claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Balanced performance for most use cases',
      features: ['Balanced performance', 'Good reasoning', 'Reliable', 'Versatile'],
      pricing: 'Medium',
      speed: 'Fast',
      recommended: false,
      icon: Star
    },
    {
      id: 'google/gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Google\'s advanced AI model with multimodal capabilities',
      features: ['Multimodal', 'Google trained', 'Good for analysis', 'Image understanding'],
      pricing: 'Medium',
      speed: 'Fast',
      recommended: false,
      icon: Info
    }
  ];

  const handleSelectModel = (modelId) => {
    // Update user preference
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        model: modelId
      }
    };
    localStorage.setItem('parth_ai_current_user', JSON.stringify(updatedUser));
    navigate('/chat');
  };

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
          title="AI Models"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Models Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                <span className="gradient-text">AI Models</span>
              </h1>
              <p className="text-lg text-text-muted">
                Choose the right AI model for your needs
              </p>
            </div>

            {/* Current Selection */}
            <div className="glass-card p-6 mb-8 animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm mb-1">Currently Selected</p>
                  <p className="text-xl font-semibold text-white">
                    {user?.preferences?.model || 'openai/gpt-oss-120b:free'}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all"
                >
                  Change in Settings
                </button>
              </div>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model, index) => (
                <div
                  key={index}
                  className={`glass-card p-6 animate-slide-up relative ${
                    model.recommended ? 'border-primary/30' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {model.recommended && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                      Recommended
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <model.icon size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                      <p className="text-sm text-text-muted">{model.provider}</p>
                    </div>
                  </div>

                  <p className="text-text-muted text-sm mb-4">{model.description}</p>

                  <div className="space-y-2 mb-4">
                    {model.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-text-muted">
                        <Check size={14} className="text-emerald-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} className="text-text-muted" />
                        <span className="text-sm text-text-muted">{model.pricing}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={16} className="text-text-muted" />
                        <span className="text-sm text-text-muted">{model.speed}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectModel(model.id)}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-glow-sm hover:shadow-glow"
                  >
                    Select Model
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Info Section */}
            <div className="glass-card p-6 mt-8 animate-slide-up">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Info size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">About AI Models</h3>
                  <p className="text-text-muted text-sm">
                    Different AI models have different strengths and capabilities. 
                    The free model (GPT-OSS 120B) is great for general use, while premium models 
                    offer advanced features like better reasoning, multimodal understanding, and faster responses. 
                    You can change your preferred model in Settings at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
