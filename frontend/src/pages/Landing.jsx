import { Link } from 'react-router-dom';
import { Sparkles, Bot, MessageSquare, Zap, Shield, ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        
        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <Logo size="medium" />
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-text-muted hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 gradient-primary text-white rounded-xl hover:opacity-90 transition-all shadow-glow-sm"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light mb-8">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              Meet <span className="gradient-text">ParthAI</span>
            </h1>
            
            <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
              Your intelligent AI assistant for coding, learning, and productivity. 
              Experience the future of conversation with cutting-edge AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 glass-card text-white font-semibold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose ParthAI?</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Experience the next generation of AI-powered assistance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-all">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-glow-sm">
              <Bot size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Advanced AI Models</h3>
            <p className="text-text-muted">
              Powered by state-of-the-art language models for accurate and helpful responses
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-all">
            <div className="w-14 h-14 rounded-xl gradient-secondary flex items-center justify-center mb-6 shadow-glow-sm">
              <MessageSquare size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Natural Conversations</h3>
            <p className="text-text-muted">
              Engage in natural, context-aware conversations that understand your needs
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-all">
            <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-6 shadow-glow-sm">
              <Zap size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
            <p className="text-text-muted">
              Get instant responses with optimized performance and minimal latency
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-all">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-glow-sm">
              <Sparkles size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Image Generation</h3>
            <p className="text-text-muted">
              Generate stunning images with AI-powered image creation capabilities
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-all">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-glow-sm">
              <Shield size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Secure & Private</h3>
            <p className="text-text-muted">
              Your data is encrypted and protected with enterprise-grade security
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:border-primary/30 transition-all">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 shadow-glow-sm">
              <MessageSquare size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Multi-Language</h3>
            <p className="text-text-muted">
              Communicate in English, Hindi, Gujarati, and more languages
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="glass-card p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-text-muted mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already experiencing the future of AI assistance
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-glow hover:shadow-glow-lg"
            >
              Create Free Account
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-text-muted text-sm">
          <p>&copy; 2024 ParthAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
