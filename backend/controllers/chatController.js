const sendMessage = async (req, res) => {
  try {
    const { chatId, message, model, language } = req.body;

    let chat;

    if (chatId) {
      chat = chats.get(chatId);

      if (!chat || chat.user !== req.user._id) {
        return res.status(404).json({ message: 'Chat not found' });
      }
    } else {
      const newChatId = Date.now().toString();

      chat = {
        id: newChatId,
        user: req.user._id,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        model: model || 'local-ai',
        language: language || 'english',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      chats.set(newChatId, chat);
    }

    // Save user message
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Local AI response
    let aiResponse = '';

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      aiResponse =
        'Hello! 👋 I am Parth AI. How can I help you today?';
    } else if (lowerMessage.includes('who are you')) {
      aiResponse =
        'I am Parth AI, your personal AI assistant built by Parth Patel.';
    } else if (lowerMessage.includes('html')) {
      aiResponse =
        'HTML is the standard markup language used to create web pages.';
    } else if (lowerMessage.includes('css')) {
      aiResponse =
        'CSS is used to style HTML elements and create beautiful user interfaces.';
    } else if (lowerMessage.includes('javascript')) {
      aiResponse =
        'JavaScript is a programming language used to make websites interactive.';
    } else {
      aiResponse = `You said: "${message}"

Parth AI is currently running in Local Mode.

To get real AI responses, connect OpenRouter or another AI provider.`;
    }

    // Save AI message
    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    chat.updatedAt = new Date();

    chats.set(chat.id, chat);

    res.json({
      chat,
      reply: aiResponse
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Something went wrong'
    });
  }
};