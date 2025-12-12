# Deployment Guide

## ✅ Local Development (No Changes)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET

# 3. Seed database (optional)
npm run seed

# 4. Run locally (same as before)
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## 🚀 Deploy to Vercel

### Step 1: Setup MongoDB Atlas

1. Go to https://mongodb.com/cloud/atlas
2. Create free account → Create cluster
3. Database Access → Add user (save username/password)
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Connect → Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/taskflow
   ```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Step 3: Set Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these:
- `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/taskflow`
- `JWT_SECRET` = `your-super-secret-key-123`
- `NODE_ENV` = `production`

### Step 4: Redeploy

```bash
vercel --prod
```

## 🎯 How It Works

### Local Development
- Uses `server.js` (Express server on port 5000)
- Frontend connects to `http://localhost:5000/api`
- MongoDB: Local or Atlas

### Vercel Production
- Uses `api/index.js` (Serverless function)
- Frontend connects to `/api` (same domain)
- MongoDB: Atlas only
- Both frontend & backend on same Vercel domain

## 🔧 Troubleshooting

**Error: Cannot connect to MongoDB**
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify connection string in Vercel env vars

**Error: JWT_SECRET not defined**
- Add JWT_SECRET in Vercel environment variables
- Redeploy after adding

**Frontend can't reach API**
- Check browser console for CORS errors
- Verify VITE_API_URL is set correctly
