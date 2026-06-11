import { useState } from 'react';
import { Cpu, ChevronDown, Sparkles } from 'lucide-react';

export default function ModelSelector({ selectedModel, onModelChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const models = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Most capable model for complex tasks',
      icon: Sparkles,
      badge: 'Premium',
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and efficient for most tasks',
      icon: Cpu,
      badge: 'Fast',
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      description: 'Great for analysis and reasoning',
      icon: Sparkles,
      badge: 'New',
    },
  ];

  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 glass-card hover:border-primary/30 transition-all duration-200"
      >
        <currentModel.icon size={18} className="text-primary" />
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-white">{currentModel.name}</p>
          <p className="text-xs text-text-muted">{currentModel.description}</p>
        </div>
        <ChevronDown size={16} className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card shadow-glow-sm z-50 animate-slide-up">
          <div className="p-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                  selectedModel === model.id
                    ? 'bg-primary/20 border border-primary/30'
                    : 'hover:bg-white/5'
                }`}
              >
                <model.icon size={18} className={selectedModel === model.id ? 'text-primary' : 'text-text-muted'} />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${selectedModel === model.id ? 'text-white' : 'text-text-muted'}`}>
                      {model.name}
                    </p>
                    {model.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                        {model.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
