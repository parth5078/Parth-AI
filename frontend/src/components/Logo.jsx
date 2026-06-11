import { BrainCircuit } from 'lucide-react';

export default function Logo({ size = 'default', className = '' }) {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-10 h-10',
  };

  const textSizeClasses = {
    small: 'text-sm',
    default: 'text-lg',
    large: 'text-xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizeClasses[size] || sizeClasses.default}`}>
        <div className="absolute inset-0 gradient-primary rounded-lg blur-sm opacity-50"></div>
        <div className="relative gradient-primary rounded-lg flex items-center justify-center">
          <BrainCircuit className="text-white" size={size === 'small' ? 14 : size === 'large' ? 24 : 18} />
        </div>
      </div>
      <span className={`font-bold gradient-text ${textSizeClasses[size] || textSizeClasses.default}`}>
        ParthAI
      </span>
    </div>
  );
}
