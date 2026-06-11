# 🤖 Parth AI

**Your Personal AI Assistant**

A production-ready AI SaaS application with a modern ChatGPT-like interface, built with React, Node.js, MongoDB, and OpenRouter API.

## ✨ Features

### Core Features
- **Modern ChatGPT-style UI** - Beautiful dark theme with glassmorphism effects
- **Authentication System** - JWT-based secure authentication with registration and login
- **Chat History Management** - Create, rename, delete, and manage multiple conversations
- **Markdown Rendering** - Rich text formatting with syntax highlighting for code blocks
- **Multi-language Support** - English, Gujarati, and Hindi language options
- **Voice Input** - Speech-to-text functionality for hands-free messaging
- **Settings Page** - Customize theme, language, and AI model preferences
- **Responsive Design** - Mobile-friendly interface

### AI Features
- **Multiple AI Models** - Support for GPT-4, GPT-4o, Claude 3, and more via OpenRouter
- **Context-aware Conversations** - Maintains conversation history
- **Smart Responses** - Intelligent AI responses tailored to user preferences

### Security Features
- **Password Hashing** - Secure password storage with bcrypt
- **JWT Authentication** - Token-based authentication system
- **Rate Limiting** - API rate limiting to prevent abuse
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured CORS for secure cross-origin requests

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code syntax highlighting
- **Lucide React** - Icon library
- **Zustand** - State management
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for OpenRouter API

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- OpenRouter API key

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/parth-ai.git
cd parth-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/parth-ai?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Start Backend

```bash
cd backend
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📦 Deployment

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` - Your deployed backend API URL
3. Deploy!

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `OPENROUTER_API_KEY` - Your OpenRouter API key
   - `PORT` - 5000 (or your preferred port)
   - `FRONTEND_URL` - Your deployed frontend URL
   - `NODE_ENV` - production
3. Deploy!

### MongoDB Atlas Setup

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for deployment)
5. Get your connection string and add it to `.env`

### OpenRouter API Setup

1. Create an account at [OpenRouter](https://openrouter.ai/)
2. Get your API key
3. Add it to your `.env` file

## 📁 Project Structure

```
parth-ai/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── chatController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Chat.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── chat.js
│   ├── services/
│   │   └── openrouterService.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatSidebar.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── ChatInput.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Models.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Chat

- `GET /api/chat` - Get all user chats
- `GET /api/chat/:id` - Get specific chat
- `POST /api/chat` - Create new chat
- `POST /api/chat/message` - Send message
- `DELETE /api/chat/:id` - Delete chat
- `PUT /api/chat/:id` - Update chat

## 🎨 Theme Colors

- **Primary**: #2563EB (Blue)
- **Secondary**: #1E293B (Slate)
- **Background**: #020617 (Dark)
- **Text**: #F8FAFC (Light)
- **Accent**: #38BDF8 (Sky Blue)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Parth AI** - Your Personal AI Assistant

---

Built with ❤️ using React, Node.js, and MongoDB
