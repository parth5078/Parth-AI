const Chat = require('../models/Chat');
const { chatCompletion } = require('../services/openrouterService');

const createChat = async (req, res) => {
  try {
    const { title, model, language } = req.body;

    const chat = await Chat.create({
      user: req.user._id,
      title: title || 'New Chat',
      model: model || 'openai/gpt-oss-120b:free',
      language: language || 'english',
      messages: []
    });

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create chat' });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select('-messages');

    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
};

const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch chat' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, message, model, language } = req.body;

    let chat;

    if (chatId) {
      chat = await Chat.findOne({
        _id: chatId,
        user: req.user._id
      });

      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
    } else {
      chat = await Chat.create({
        user: req.user._id,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        model: model || 'openai/gpt-oss-120b:free',
        language: language || 'english',
        messages: []
      });
    }

    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    const imageGenRegex = /^(generate image|create image|draw|paint|make an image|image:)/i;
    const isImageGeneration = imageGenRegex.test(message);

    let aiResponse;

    if (isImageGeneration) {
      const imagePrompt = message.replace(imageGenRegex, '').trim() || message;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&nologo=true`;
      aiResponse = `I've generated an image based on your request: "${imagePrompt}"\n\n![Generated Image](${imageUrl})`;
    } else {
      const messagesToSend = chat.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      aiResponse = await chatCompletion(
        messagesToSend,
        chat.model,
        chat.language
      );
    }

    chat.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    await chat.save();

    res.json({
      chat,
      reply: aiResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: error.message || 'Failed to send message' 
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete chat' });
  }
};

const updateChat = async (req, res) => {
  try {
    const { title, model, language } = req.body;

    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      {
        title,
        model,
        language
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update chat' });
  }
};

module.exports = {
  createChat,
  getChats,
  getChatById,
  sendMessage,
  deleteChat,
  updateChat
};
