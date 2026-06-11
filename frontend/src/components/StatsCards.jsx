import { MessageSquare, Brain, Clock, TrendingUp } from 'lucide-react';

export default function StatsCards() {
  const stats = [
    {
      icon: MessageSquare,
      label: 'Total Conversations',
      value: '24',
      change: '+12%',
      positive: true,
    },
    {
      icon: Brain,
      label: 'AI Responses',
      value: '156',
      change: '+8%',
      positive: true,
    },
    {
      icon: Clock,
      label: 'Avg Response Time',
      value: '1.2s',
      change: '-15%',
      positive: true,
    },
    {
      icon: TrendingUp,
      label: 'Token Usage',
      value: '45.2K',
      change: '+23%',
      positive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="glass-card p-5 hover:border-primary/30 transition-all duration-300 animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <stat.icon size={20} className="text-primary" />
            </div>
            <span className={`text-xs font-medium ${
              stat.positive ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
          <p className="text-sm text-text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
