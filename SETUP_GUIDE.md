# 🚀 Quick Setup Guide

Follow these steps to get Parth AI running locally.

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env)
Copy `.env.example` to `.env` and fill in the values:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your actual values:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Generate a secure random string (use: `openssl rand -base64 32`)
- `OPENROUTER_API_KEY` - Get from https://openrouter.ai/
- `PORT` - 5000 (or your preferred port)
- `FRONTEND_URL` - http://localhost:5173
- `NODE_ENV` - development

### Frontend (.env)
Copy `.env.example` to `.env`:

```bash
cd frontend
cp .env.example .env
```

The default value should work for local development:
```
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Start MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and add it to backend `.env`

## Step 4: Get OpenRouter API Key

1. Go to [OpenRouter](https://openrouter.ai/)
2. Create an account
3. Generate an API key
4. Add it to backend `.env`

## Step 5: Run the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```

Backend will run on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on http://localhost:5173

## Step 6: Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign up" to create a new account
3. Fill in username, email, and password
4. Login with your credentials
5. Start chatting with Parth AI!
6. Test features:
   - Create new chats
   - View chat history
   - Delete chats
   - Change settings (theme, language, model)
   - Try voice input
   - Test markdown rendering

## Troubleshooting

### MongoDB Connection Error
- Verify your connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### OpenRouter API Error
- Verify your API key is valid
- Check your OpenRouter account has credits
- Ensure the model ID is correct

### Frontend Can't Connect to Backend
- Ensure backend is running on port 5000
- Check CORS configuration in backend
- Verify `VITE_API_URL` in frontend `.env`

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Ensure Node.js version is 18 or higher

## Next Steps

After successful local testing:
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Update environment variables for production

## Support

For issues or questions:
- Check the main [README.md](./README.md)
- Review [DEPLOYMENT.md](./DEPLOYMENT.md)
- Check logs in both backend and frontend terminals

---

Happy coding! 🎉
