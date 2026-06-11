const axios = require('axios');

// Simple in-memory chat storage (for development only)
// In production, this would be replaced with a proper database
const chats = new Map();

const getSystemPrompt = (language) => {
  const languagePrompts = {
    english: `You are Parth AI.

Rules:
- Introduce yourself as Parth AI when asked.
- Be friendly and professional.
- Help with coding, internships, careers, AI, web development and general questions.
- Use simple English.
- Use bullet points when helpful.
- Avoid HTML tags.
- Avoid markdown tables.
- Give clean and readable answers.`,
    gujarati: `You are Parth AI.

Rules:
- Introduce yourself as Parth AI when asked.
- Be friendly and professional.
- Help with coding, internships, careers, AI, web development and general questions.
- Respond in Gujarati when the user speaks Gujarati.
- Use bullet points when helpful.
- Avoid HTML tags.
- Avoid markdown tables.
- Give clean and readable answers.`,
    hindi: `You are Parth AI.

Rules:
- Introduce yourself as Parth AI when asked.
- Be friendly and professional.
- Help with coding, internships, careers, AI, web development and general questions.
- Respond in Hindi when the user speaks Hindi.
- Use bullet points when helpful.
- Avoid HTML tags.
- Avoid markdown tables.
- Give clean and readable answers.`
  };
  
  return languagePrompts[language] || languagePrompts.english;
};

const createChat = async (req, res) => {
  try {
    const { title, model, language } = req.body;
    
    const chatId = Date.now().toString();
    const chat = {
      id: chatId,
      user: req.user._id,
      title: title || 'New Chat',
      model: model || 'openai/gpt-oss-120b:free',
      language: language || 'english',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    chats.set(chatId, chat);
    
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getChats = async (req, res) => {
  try {
    const userChats = [];
    for (const [id, chat] of chats.entries()) {
      if (chat.user === req.user._id) {
        userChats.push({
          id: chat.id,
          title: chat.title,
          model: chat.model,
          language: chat.language,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        });
      }
    }
    
    userChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.json(userChats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getChatById = async (req, res) => {
  try {
    const chat = chats.get(req.params.id);
    
    if (!chat || chat.user !== req.user._id) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

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
        model: model || 'openai/gpt-oss-120b:free',
        language: language || 'english',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      chats.set(newChatId, chat);
    }
    
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: chat.model,
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(chat.language)
          },
          ...chat.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'Parth AI'
        }
      }
    );
    
    const aiResponse = response.data.choices[0].message.content;
    
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
    console.error('OpenRouter Error:', error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.error?.message || 'Something went wrong'
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const chat = chats.get(req.params.id);
    
    if (!chat || chat.user !== req.user._id) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    chats.delete(req.params.id);
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateChat = async (req, res) => {
  try {
    const { title } = req.body;
    
    const chat = chats.get(req.params.id);
    
    if (!chat || chat.user !== req.user._id) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (title) chat.title = title;
    chat.updatedAt = new Date();
    
    chats.set(req.params.id, chat);
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createChat, getChats, getChatById, sendMessage, deleteChat, updateChat };
