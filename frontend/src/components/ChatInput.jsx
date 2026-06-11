import { useState, useRef } from 'react';
import { Send, Mic, Image as ImageIcon, Paperclip, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if ((message.trim() || uploadedFiles.length > 0) && !disabled) {
      onSendMessage(message, uploadedFiles);
      setMessage('');
      setUploadedFiles([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      toast('Listening...', { icon: '🎤' });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prev => prev + transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast.error('Voice input failed');
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('Please select image files only');
      return;
    }

    try {
      const processedFiles = await Promise.all(imageFiles.map(processFile));
      setUploadedFiles(prev => [...prev, ...processedFiles]);
      toast.success(`${imageFiles.length} image(s) uploaded`);
    } catch (error) {
      toast.error('Failed to process images');
    }
    
    e.target.value = '';
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const processedFiles = await Promise.all(files.map(processFile));
      setUploadedFiles(prev => [...prev, ...processedFiles]);
      toast.success(`${files.length} file(s) uploaded`);
    } catch (error) {
      toast.error('Failed to process files');
    }
    
    e.target.value = '';
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-white/10 p-4 lg:p-6 glass">
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Uploaded files preview */}
      {uploadedFiles.length > 0 && (
        <div className="max-w-4xl mx-auto mb-4 flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="relative group flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={file.data}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded-lg"
                />
              ) : (
                <Paperclip size={16} className="text-text-muted" />
              )}
              <span className="text-sm text-white truncate max-w-32">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-red-500/20 rounded-lg transition-all"
              >
                <X size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <div className="flex gap-2">
          <button
            onClick={handleImageUpload}
            className="p-3 text-text-muted hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            title="Upload image"
          >
            <ImageIcon size={20} />
          </button>
          <button
            onClick={handleFileUpload}
            className="p-3 text-text-muted hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            title="Upload file"
          >
            <Paperclip size={20} />
          </button>
        </div>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message ParthAI..."
            disabled={disabled}
            rows={1}
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent resize-none transition-all duration-200 shadow-glow-sm"
            style={{ minHeight: '52px', maxHeight: '200px' }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleVoiceInput}
            disabled={disabled}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-glow-sm' 
                : 'text-text-muted hover:text-white hover:bg-white/10'
            }`}
            title="Voice input"
          >
            <Mic size={20} />
          </button>
          <button
            onClick={handleSend}
            disabled={disabled || (!message.trim() && uploadedFiles.length === 0)}
            className="p-3 gradient-primary text-white rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm hover:shadow-glow"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
