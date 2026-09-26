# ⚡ Deploy to Vercel in 10 Steps

## Step 1️⃣: Push to GitHub

```bash
cd amazon-clone
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/amazon-clone.git
git branch -M main
git push -u origin main
```

---

## Step 2️⃣: Create Free Database (PlanetScale)

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with GitHub
3. Create database → Name: `amazon-clone`
4. **Connect** → Copy MySQL connection string
5. Save for later: `mysql://user:pass@host/db`

---

## Step 3️⃣: Deploy Backend

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Go to backend folder
cd backend

# Deploy
vercel --prod
```

You'll get: `https://amazon-clone-backend.vercel.app` ✅

---

## Step 4️⃣: Add Backend Environment Variables

1. Open [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **amazon-clone-backend** project
3. **Settings** → **Environment Variables**
4. Add these:
   ```
   DB_HOST = your-host
   DB_USER = your-user
   DB_PASSWORD = your-pass
   DB_NAME = amazon_clone
   JWT_SECRET = any-random-string
   ```
5. Click **Deploy** to redeploy

---

## Step 5️⃣: Setup Database

1. Go to PlanetScale → Console
2. Copy entire SQL from `database/schema.sql`
3. Paste & run in console
4. Done! ✅

---

## Step 6️⃣: Update Frontend Env

Create `/frontend/.env.production`:
```
REACT_APP_API_URL=https://amazon-clone-backend.vercel.app/api
```

---

## Step 7️⃣: Deploy Frontend

```bash
cd frontend
vercel --prod
```

You'll get: `https://amazon-clone.vercel.app` ✅

---

## Step 8️⃣: Add Frontend Environment Variables

1. Open [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **amazon-clone** project
3. **Settings** → **Environment Variables**
4. Add:
   ```
   REACT_APP_API_URL = https://amazon-clone-backend.vercel.app/api
   ```
5. Click **Deploy** to redeploy

---

## Step 9️⃣: Test Everything

```bash
# Test backend
curl https://amazon-clone-backend.vercel.app/api/health

# Should show: {"status":"Server running"}

# Visit frontend
https://amazon-clone.vercel.app
```

---

## Step 🔟: Enable Auto-Deploy

Every push to GitHub now auto-deploys! 🚀

```bash
# Make changes
git add .
git commit -m "Update features"
git push origin main

# Check: vercel.com/dashboard → Deployments
```

---

## 🎯 Your Live URLs

| What | URL |
|------|-----|
| Store | `https://amazon-clone.vercel.app` |
| API | `https://amazon-clone-backend.vercel.app/api` |

---

## 🆘 Quick Fixes

**Blank page?**
- Check browser console (F12)
- Verify env vars on Vercel

**API errors?**
- Check backend logs: Vercel → Deployments → Logs
- Verify database connection

**CORS errors?**
- Add this to backend `server.js`:
```javascript
app.use(cors({ origin: "*" }));
```

---

## Demo Credentials

| Type | Email | Password |
|------|-------|----------|
| Admin | admin@amazon.com | admin123 |
| User | Create new | - |

---

**That's it! You're live! 🎉**
