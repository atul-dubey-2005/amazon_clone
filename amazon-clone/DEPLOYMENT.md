# Deploy Amazon Clone to Vercel (from GitHub)

## 🎯 Complete Deployment Guide

---

## PART 1: Push Code to GitHub

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) → Sign in
2. Click **"New"** (or go to github.com/new)
3. Repository name: `amazon-clone`
4. Description: `Amazon Clone E-Commerce Platform`
5. Select **Public** (so Vercel can access it)
6. Click **"Create repository"**

### Step 2: Initialize Git & Push Code

```bash
cd amazon-clone

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Amazon clone full stack"

# Add remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/amazon-clone.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Verify on GitHub

Visit `https://github.com/YOUR_USERNAME/amazon-clone` - you should see all your files

---

## PART 2: Setup Database (PlanetScale or Railway)

### Option A: PlanetScale (MySQL in the Cloud) ✅ RECOMMENDED

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up (free account)
3. Create new database → Name: `amazon-clone`
4. Go to **Develop** tab → Copy MySQL connection string
   ```
   mysql://user:password@host/amazon-clone
   ```
5. Click **"Connect"** → Select **Node.js**
6. Copy the connection string (you'll need this later)

**Add environment variable to .env:**
```
DATABASE_URL=mysql://user:password@host/amazon-clone
```

### Option B: Railway.app (Simple Setup)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (easier)
3. Click **"New Project"** → MySQL
4. Go to **MySQL** → Click **"Connect"**
5. Copy the database URL

---

## PART 3: Deploy Backend on Vercel

### Step 1: Create `vercel.json` in Backend

Create `/backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Update Backend for Production

Edit `/backend/server.js` - change MySQL pool config:

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

Or use connection string:
```javascript
const pool = mysql.createPool(process.env.DATABASE_URL);
```

### Step 3: Verify Backend .env.example

Ensure `/backend/.env.example` has:
```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DATABASE_URL=
JWT_SECRET=your_secret_key
PORT=5000
```

### Step 4: Deploy Backend to Vercel

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Navigate to backend folder
cd backend

# Deploy
vercel --prod
```

After deployment:
- You'll get a URL like: `https://amazon-clone-backend.vercel.app`
- Copy this URL (you'll need it for frontend)

### Step 5: Set Environment Variables on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your **amazon-clone** project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - `DB_HOST` = your database host
   - `DB_USER` = your database user
   - `DB_PASSWORD` = your database password
   - `DB_NAME` = amazon_clone
   - `JWT_SECRET` = generate random string
   - (or `DATABASE_URL` if using connection string)

5. Click **Deploy** to redeploy with new env vars

### Step 6: Test Backend

```bash
# Test the health endpoint
curl https://amazon-clone-backend.vercel.app/api/health

# Should return: {"status":"Server running"}
```

---

## PART 4: Deploy Frontend on Vercel

### Step 1: Update Frontend .env

Create `/frontend/.env.production`:

```env
REACT_APP_API_URL=https://amazon-clone-backend.vercel.app/api
```

(Replace with your actual backend URL from Step 3)

### Step 2: Update package.json

Edit `/frontend/package.json` → add this line in scripts:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Step 3: Create Vercel Config (Optional)

Create `/frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url"
  }
}
```

### Step 4: Commit & Push Frontend Changes

```bash
cd frontend

git add .
git commit -m "Add production environment variables"
git push origin main
```

### Step 5: Deploy Frontend to Vercel

**Option A: Through Vercel Dashboard (Easiest)**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Search for your `amazon-clone` repository → Click **Import**
5. Choose **React** as framework
6. In **Environment Variables** section, add:
   ```
   REACT_APP_API_URL = https://amazon-clone-backend.vercel.app/api
   ```
7. Click **"Deploy"**

Vercel will automatically:
- Build the React app
- Deploy to a live URL
- Set up CI/CD (auto-deploys on push)

**Option B: Through CLI**

```bash
cd frontend
vercel --prod
```

### Step 6: Frontend URL

After deployment, you'll get a URL like:
- `https://amazon-clone.vercel.app`

---

## PART 5: Setup Database Schema on Production

### Option 1: Using PlanetScale Dashboard

1. Go to PlanetScale dashboard
2. Select your database → **"Console"**
3. Copy and paste the SQL from `database/schema.sql`
4. Run it

### Option 2: Run Script via Backend

Add this endpoint in your backend temporarily (remove after):

```javascript
app.post('/api/setup-database', async (req, res) => {
  try {
    const conn = await global.db.getConnection();
    const schema = require('fs').readFileSync('database/schema.sql', 'utf8');
    await conn.query(schema);
    conn.release();
    res.json({ message: 'Database setup complete' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

Then call:
```bash
curl -X POST https://amazon-clone-backend.vercel.app/api/setup-database
```

---

## PART 6: Configure Vercel Deployment Settings

### For Backend

1. Go to Vercel Dashboard → **amazon-clone-backend**
2. **Settings** → **Environment Variables**
3. Add all required variables
4. **Deployments** → Click latest → **Redeploy**

### For Frontend

1. Go to Vercel Dashboard → **amazon-clone**
2. **Settings** → **Environment Variables**
3. Add:
   - `REACT_APP_API_URL` = your backend URL
4. **Deployments** → **Redeploy**

---

## 🚀 LIVE! Your URLs

After deployment, you'll have:

| Component | URL |
|-----------|-----|
| **Frontend** | `https://amazon-clone.vercel.app` |
| **Backend API** | `https://amazon-clone-backend.vercel.app/api` |
| **Health Check** | `https://amazon-clone-backend.vercel.app/api/health` |

---

## ✅ Final Testing

### 1. Test Frontend
```bash
# Visit in browser
https://amazon-clone.vercel.app
```

Should show homepage with products ✅

### 2. Test API Connection
```bash
# Backend health check
curl https://amazon-clone-backend.vercel.app/api/health

# Should return: {"status":"Server running"}
```

### 3. Test Full Flow
1. Register a new account
2. Browse products
3. Add to cart
4. Checkout
5. Verify order appears

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Frontend shows blank page** | Check browser console (F12). Verify REACT_APP_API_URL in Vercel env vars |
| **API calls fail (CORS)** | Add to backend: `cors({ origin: '*' })` or whitelist frontend URL |
| **Database connection failed** | Check DB credentials in Vercel env vars. Verify DB is running |
| **500 errors** | Check backend logs: Vercel Dashboard → Deployments → Logs |
| **Changes not showing** | Vercel auto-redeploys on push. Wait 2-3 mins. Force refresh (Ctrl+Shift+R) |

### Enable Vercel Logs
```bash
# Watch real-time logs
vercel logs https://amazon-clone-backend.vercel.app --tail
```

---

## 📱 CI/CD Setup (Auto-Deploy)

Your setup already has CI/CD! Every time you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update features"
git push origin main

# ✅ Vercel automatically rebuilds & deploys
# Check: vercel.com/dashboard → Deployments
```

---

## 🔐 Security Checklist

- ✅ Don't commit `.env` file (use `.env.example`)
- ✅ Add secrets to Vercel env vars (never in code)
- ✅ Use strong `JWT_SECRET`
- ✅ Enable HTTPS (Vercel does by default)
- ✅ Set CORS properly: `cors({ origin: process.env.FRONTEND_URL })`

---

## 📊 Production Improvements

To make it production-ready:

1. **Database Backups** - PlanetScale includes backups
2. **Monitoring** - Add Sentry for error tracking
3. **Email** - SendGrid for order notifications
4. **CDN** - Cloudinary for product images
5. **Analytics** - Google Analytics
6. **Rate Limiting** - Add express-rate-limit

---

## 🎉 DONE!

Your Amazon Clone is now live on Vercel with:
- ✅ Frontend at `vercel.app`
- ✅ Backend API running serverlessly
- ✅ MySQL database in the cloud
- ✅ Auto-deploy on GitHub push
- ✅ Free tier (generous limits)

**Share your links with others!** 🚀
