import { useNavigate } from 'react-router-dom';
import { Heart, Code, Zap, Users, Target, Mail, Github, Twitter } from 'lucide-react';
import Logo from '../components/Logo';

export default function About() {
  const navigate = useNavigate();

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">About ParthAI</h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            Your intelligent AI assistant built with passion and cutting-edge technology
          </p>
        </div>

        {/* Mission */}
        <div className="glass-card p-8 rounded-2xl mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow-sm">
              <Target size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-3">Our Mission</h2>
              <p className="text-text-muted leading-relaxed">
                ParthAI is dedicated to making advanced AI technology accessible to everyone. 
                We believe in creating tools that enhance productivity, foster learning, and 
                empower users to achieve more. Our goal is to provide a seamless, intuitive, 
                and powerful AI assistant that adapts to your needs.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center mb-4 shadow-glow-sm">
              <Zap size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-text-muted">
              Optimized for speed with minimal latency, ensuring you get instant responses
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4 shadow-glow-sm">
              <Code size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Built for Developers</h3>
            <p className="text-text-muted">
              Specialized in helping with coding, debugging, and technical problem-solving
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-glow-sm">
              <Users size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">User-Centric Design</h3>
            <p className="text-text-muted">
              Designed with users in mind, featuring intuitive interfaces and seamless experiences
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4 shadow-glow-sm">
              <Heart size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Made with Love</h3>
            <p className="text-text-muted">
              Crafted with passion and attention to detail to provide the best experience
            </p>
          </div>
        </div>

        {/* Technology */}
        <div className="glass-card p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'React',
              'Node.js',
              'MongoDB',
              'OpenRouter AI',
              'Express',
              'TailwindCSS',
              'Vite',
              'Lucide Icons'
            ].map((tech) => (
              <div
                key={tech}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center text-white hover:border-primary/30 transition-all"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Get In Touch</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:support@parthai.com"
              className="flex items-center gap-2 px-6 py-3 glass-card hover:bg-white/10 transition-all text-white"
            >
              <Mail size={18} />
              Email Us
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 glass-card hover:bg-white/10 transition-all text-white"
            >
              <Github size={18} />
              GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 glass-card hover:bg-white/10 transition-all text-white"
            >
              <Twitter size={18} />
              Twitter
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-text-muted text-sm">
          <p>&copy; 2024 ParthAI. Built with ❤️ by Parth Patel</p>
        </div>
      </div>
    </div>
  );
}
