const axios = require('axios');

const getSystemPrompt = (language) => {
  const languagePrompts = {
    english: `You are ParthAI.
A professional AI assistant created by Parth Patel.
You help with:
- Coding
- AI
- Career guidance
- Placements
- Internships
- Resume building
- Web development
- Mobile development
- General questions

Rules:
- Introduce yourself as ParthAI when asked.
- Be friendly and professional.
- Use simple English.
- Use bullet points when helpful.
- Avoid HTML tags.
- Avoid markdown tables.
- Give clean and readable answers.`,
    gujarati: `You are ParthAI.
A professional AI assistant created by Parth Patel.
You help with:
- Coding
- AI
- Career guidance
- Placements
- Internships
- Resume building
- Web development
- Mobile development
- General questions

Rules:
- Introduce yourself as ParthAI when asked.
- Be friendly and professional.
- Respond in Gujarati when the user speaks Gujarati.
- Use bullet points when helpful.
- Avoid HTML tags.
- Avoid markdown tables.
- Give clean and readable answers.`,
    hindi: `You are ParthAI.
A professional AI assistant created by Parth Patel.
You help with:
- Coding
- AI
- Career guidance
- Placements
- Internships
- Resume building
- Web development
- Mobile development
- General questions

Rules:
- Introduce yourself as ParthAI when asked.
- Be friendly and professional.
- Respond in Hindi when the user speaks Hindi.
- Use bullet points when helpful.
- Avoid HTML tags.
- Avoid markdown tables.
- Give clean and readable answers.`
  };
  
  return languagePrompts[language] || languagePrompts.english;
};

const chatCompletion = async (messages, model, language = 'english') => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model || 'openai/gpt-oss-120b:free',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(language)
          },
          ...messages
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:5173',
          'X-Title': 'ParthAI'
        },
        timeout: 60000
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenRouter API key');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else if (error.response?.status === 500) {
      throw new Error('OpenRouter server error. Please try again.');
    }
    
    throw new Error('Failed to get AI response. Please try again.');
  }
};

const supportedModels = [
  {
    id: 'openai/gpt-oss-120b:free',
    name: 'GPT OSS 120B (Free)',
    provider: 'OpenAI'
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'DeepSeek'
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B',
    provider: 'Meta'
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    provider: 'Google'
  }
];

module.exports = {
  chatCompletion,
  getSystemPrompt,
  supportedModels
};
