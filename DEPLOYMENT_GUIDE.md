# 🚀 Deployment Guide for GraphQL Todo App

## 📋 Prerequisites
- Vercel account
- GitHub repository
- MongoDB Atlas account

## 🗂️ Environment Setup

### 1. Backend Environment (server directory)

Create `server/.env` file from `server/env.example.txt`:

```bash
cd server
cp env.example.txt .env
```

Update `.env` with your values:
```env
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster0.bmvkqcj.mongodb.net/graphql_todo?retryWrites=true&w=majority&appName=Cluster0

# Server Configuration
PORT=4000
NODE_ENV=production

# CORS Configuration (Frontend URLs)
FRONTEND_URL=https://your-frontend-url.vercel.app
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:3000
```

### 2. Frontend URL Configuration (client directory)

No environment file needed! URLs are managed in `client/src/URL.js`:

```javascript
// Update production URLs in client/src/URL.js
production: {
  GRAPHQL_URI: 'https://your-backend-url.vercel.app/graphql',
  BACKEND_URL: 'https://your-backend-url.vercel.app'
}
```

## 🚀 Deployment Steps

### Step 1: Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend  
cd client
npm install
```

### Step 2: Deploy Backend to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. **Important**: Set Root Directory to `server`
6. Add Environment Variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `ALLOWED_ORIGINS`: Your frontend URLs (comma-separated)

### Step 3: Deploy Frontend to Vercel

1. Update `client/src/URL.js` with your backend URL from Step 2
2. Create a new Vercel project
3. Import the same GitHub repository
4. **Important**: Set Root Directory to `client`
5. No environment variables needed for frontend! 🎉

### Step 4: Update URLs

1. Get your backend URL from Vercel (e.g., `https://your-backend.vercel.app`)
2. Get your frontend URL from Vercel (e.g., `https://your-frontend.vercel.app`)
3. Update backend environment variables in Vercel:
   - `FRONTEND_URL`: Your frontend URL
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app,http://localhost:3000`
4. Update `client/src/URL.js` production URLs:
   ```javascript
   production: {
     GRAPHQL_URI: 'https://your-backend.vercel.app/graphql',
     BACKEND_URL: 'https://your-backend.vercel.app'
   }
   ```

## 🔧 Local Development

### Backend
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm start
```

## 📝 Configuration Reference

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
PORT=4000
NODE_ENV=development|production
FRONTEND_URL=your_frontend_url
ALLOWED_ORIGINS=url1,url2,url3
```

### Frontend (client/src/URL.js)
```javascript
const config = {
  development: {
    GRAPHQL_URI: 'http://localhost:4000/graphql',
    BACKEND_URL: 'http://localhost:4000'
  },
  production: {
    GRAPHQL_URI: 'https://your-backend-url.vercel.app/graphql',
    BACKEND_URL: 'https://your-backend-url.vercel.app'
  }
};
```

## 🔒 Security Notes

- ✅ MongoDB credentials are now in environment variables
- ✅ .env files are excluded from Git via .gitignore
- ✅ CORS is configured with specific allowed origins
- ✅ URLs are centralized and configurable per environment

## 🎯 GraphQL Advantage Demonstrated

Your app showcases GraphQL's precision:
- **REST approach**: `fetch('/api/todos').then(data => data.filter(...))`
- **GraphQL approach**: `query { completedTodos { id text status } }`

Perfect for demonstrating efficient data fetching! 🔥

## 🛠️ Troubleshooting

### CORS Issues
- Ensure `ALLOWED_ORIGINS` includes your frontend URL
- Check Vercel environment variables are set correctly

### Database Connection
- Verify `MONGODB_URI` is correct in Vercel
- Ensure MongoDB Atlas allows connections from Vercel IPs (0.0.0.0/0)

### GraphQL Endpoint
- Confirm `client/src/URL.js` production URLs are correct
- Test GraphQL endpoint: `https://your-backend.vercel.app/graphql`
- Verify auto-detection: Check browser console for current environment