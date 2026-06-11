# 🚀 Deployment Guide

This guide will help you deploy Parth AI to production.

## Prerequisites

- MongoDB Atlas account
- OpenRouter API key
- Vercel account (for frontend)
- Render account (for backend)

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with username and password
5. Network Access: Add IP address `0.0.0.0/0` to allow all connections
6. Get your connection string from "Connect" → "Connect your application"
7. Replace `<password>` with your database user password

Example connection string:
```
mongodb+srv://myUser:myPassword@cluster0.mongodb.net/parth-ai?retryWrites=true&w=majority
```

## Step 2: OpenRouter API Setup

1. Go to [OpenRouter](https://openrouter.ai/)
2. Create an account
3. Navigate to API Keys section
4. Generate a new API key
5. Save this key for deployment

## Step 3: Backend Deployment (Render)

### Option A: Deploy via Render Dashboard

1. Go to [Render](https://render.com/)
2. Create a free account
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: parth-ai-backend
   - **Region**: Choose nearest region
   - **Branch**: main
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a strong random string (use: `openssl rand -base64 32`)
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `PORT`: 5000
   - `FRONTEND_URL`: Your Vercel frontend URL (add after deploying frontend)
   - `NODE_ENV`: production
7. Click "Deploy Web Service"
8. Wait for deployment to complete
9. Copy the deployed backend URL

### Option B: Deploy via Render CLI

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy
render deploy --service-name parth-ai-backend --region oregon --branch main
```

## Step 4: Frontend Deployment (Vercel)

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel](https://vercel.com/)
2. Create a free account
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
6. Add Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://parth-ai-backend.onrender.com/api`)
7. Click "Deploy"
8. Wait for deployment to complete
9. Copy the deployed frontend URL

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

## Step 5: Update Backend CORS

After deploying both frontend and backend, update the backend environment variable:

1. Go to your Render dashboard
2. Navigate to your backend service
3. Edit environment variables
4. Update `FRONTEND_URL` with your Vercel frontend URL
5. Redeploy the backend

## Step 6: Test the Deployment

1. Visit your Vercel frontend URL
2. Try registering a new account
3. Login with the new account
4. Start a chat and test the AI response
5. Test chat history
6. Test settings page

## Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parth-ai
JWT_SECRET=your_jwt_secret_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
- Check your MongoDB connection string
- Ensure IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

**CORS Error**
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that the URL includes `https://` for production

**OpenRouter API Error**
- Verify your API key is valid
- Check your OpenRouter account has credits
- Ensure the model ID is correct

### Frontend Issues

**Build Error**
- Ensure all dependencies are installed
- Check for TypeScript errors
- Verify Vite configuration

**API Connection Error**
- Verify `VITE_API_URL` is set correctly
- Check backend is running
- Ensure CORS is configured properly

## Monitoring

### Render Monitoring
- View logs in Render dashboard
- Monitor metrics in Render dashboard
- Set up alerts for errors

### Vercel Monitoring
- View logs in Vercel dashboard
- Monitor build status
- Check analytics

## Scaling

### Backend Scaling
- Upgrade to paid Render plan for better performance
- Add Redis for session management
- Implement caching for frequently accessed data

### Frontend Scaling
- Vercel automatically scales
- Enable edge functions for better performance
- Implement CDN for static assets

## Security Best Practices

1. Never commit `.env` files to Git
2. Use strong, unique passwords
3. Enable HTTPS (automatic on Vercel and Render)
4. Regularly update dependencies
5. Monitor for security vulnerabilities
6. Implement rate limiting (already included)
7. Use environment variables for sensitive data

## Cost Estimation

### Free Tier Limits
- **MongoDB Atlas**: 512MB storage (free)
- **Render**: Free tier with 750 hours/month
- **Vercel**: Free tier with unlimited bandwidth
- **OpenRouter**: Pay-as-you-go (very affordable)

### Estimated Monthly Cost
- **Development**: $0 (all free tiers)
- **Production**: $0-10 depending on usage

## Support

If you encounter issues:
1. Check the logs in Render and Vercel dashboards
2. Review this deployment guide
3. Check the main README.md
4. Open an issue on GitHub

---

Happy deploying! 🚀
