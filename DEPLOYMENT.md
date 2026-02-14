# Deploying the Backend Server Online

Instead of running on localhost, you can deploy the server to a cloud platform so it's always accessible.

## 🚀 Best Hosting Options

### 1. **Render.com (Recommended - Free Tier Available)**

✅ Free tier available
✅ Easy to deploy
✅ Supports Puppeteer out of the box
✅ Auto-deployment from GitHub

**Steps:**

1. Create account at https://render.com

2. Click "New +" → "Web Service"

3. Connect your GitHub repo (or upload files)

4. Configure:
   - **Name:** tiktok-analytics-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Click "Create Web Service"

6. Render will give you a URL like: `https://tiktok-analytics-api.onrender.com`

7. Update `popup.js` with your Render URL:
   ```javascript
   const apiUrl = `https://tiktok-analytics-api.onrender.com/api/user-region?username=${encodeURIComponent(currentUserInfo.username)}`;
   ```

**Note:** Free tier sleeps after 15 minutes of inactivity. First request may be slow.

---

### 2. **Railway.app (Easy & Fast)**

✅ $5/month starter plan
✅ Very easy deployment
✅ Good performance
✅ No sleep issues

**Steps:**

1. Go to https://railway.app and sign up

2. Click "New Project" → "Deploy from GitHub repo"

3. Railway auto-detects Node.js and deploys

4. Get your URL from the deployment

5. Update `popup.js` with your Railway URL

---

### 3. **Heroku (Popular but Paid)**

✅ Well-documented
✅ Reliable
❌ No free tier anymore (~$7/month)

**Steps:**

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

2. Login:
   ```bash
   heroku login
   ```

3. Create app:
   ```bash
   heroku create tiktok-analytics-api
   ```

4. Add Puppeteer buildpack:
   ```bash
   heroku buildpacks:add jontewks/puppeteer
   heroku buildpacks:add heroku/nodejs
   ```

5. Deploy:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. Your URL: `https://tiktok-analytics-api.herokuapp.com`

---

### 4. **Vercel (Serverless - Requires Modifications)**

✅ Free tier
❌ Requires converting to serverless functions
❌ Puppeteer needs special setup

**Not recommended for this project** - Puppeteer doesn't work well in serverless environments.

---

### 5. **DigitalOcean App Platform**

✅ Reliable
✅ Good performance
💰 ~$5/month

**Steps:**

1. Sign up at https://www.digitalocean.com

2. Create new app from GitHub

3. Configure build settings

4. Deploy and get your URL

---

### 6. **AWS EC2 or Google Cloud (Advanced)**

✅ Full control
✅ Scalable
❌ More complex setup
💰 Pay as you go

**For advanced users only.**

---

## 📝 After Deployment: Update Extension

Once you deploy to any platform, you'll get a URL like:
- `https://tiktok-analytics-api.onrender.com`
- `https://your-app.railway.app`
- `https://your-app.herokuapp.com`

**Update these 2 files:**

### 1. popup.js (Line ~90)

Change from:
```javascript
const apiUrl = `http://localhost:3000/api/user-region?username=${encodeURIComponent(currentUserInfo.username)}`;
```

To:
```javascript
const apiUrl = `https://YOUR-DEPLOYED-URL.com/api/user-region?username=${encodeURIComponent(currentUserInfo.username)}`;
```

### 2. manifest.json (Optional - for security)

Update host_permissions to include your domain:
```json
"host_permissions": [
  "https://www.tiktok.com/*",
  "https://YOUR-DEPLOYED-URL.com/*"
]
```

---

## 🔒 Important: Add API Security

Once online, anyone can access your API. Add basic security:

### Option 1: API Key Authentication

**In server.js**, add before routes:
```javascript
const API_KEY = process.env.API_KEY || 'your-secret-key-here';

app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

**In popup.js**, add to fetch:
```javascript
const response = await fetch(apiUrl, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-secret-key-here'
  }
});
```

### Option 2: Rate Limiting

Install rate limiter:
```bash
npm install express-rate-limit
```

**In server.js:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
```

---

## 🎯 Recommended Setup for You

**Best option: Render.com Free Tier**

1. Push your code to GitHub
2. Deploy to Render (free)
3. Get URL: `https://your-app.onrender.com`
4. Update `popup.js` with new URL
5. Add API key for security
6. Done!

**Pros:**
- ✅ Free
- ✅ Easy setup
- ✅ Works with Puppeteer
- ✅ HTTPS included

**Cons:**
- ⚠️ Sleeps after 15 min (first request slow)
- ⚠️ Limited to 750 hours/month

If you need it always-on without sleep, upgrade to Railway ($5/month).

---

## 📋 Quick Deployment Checklist

- [ ] Choose hosting platform
- [ ] Deploy server code
- [ ] Get deployment URL
- [ ] Update `popup.js` with new URL
- [ ] Test: `https://YOUR-URL.com/health`
- [ ] Add API security
- [ ] Reload extension in Chrome
- [ ] Test with TikTok profile

---

## 🐛 Common Deployment Issues

### Puppeteer Not Working

Some platforms need special config. Add to `server.js`:

```javascript
browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-extensions'
  ],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
});
```

### CORS Errors

Make sure CORS allows your extension:
```javascript
app.use(cors({
  origin: '*', // Or specify chrome-extension://
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-API-Key']
}));
```

### Environment Variables

Set these in your hosting platform:
- `PORT` (usually auto-set)
- `API_KEY` (for security)
- `NODE_ENV=production`

---

## 💡 Need Help?

1. **Render.com docs:** https://render.com/docs
2. **Railway docs:** https://docs.railway.app
3. **Heroku docs:** https://devcenter.heroku.com

**Pro tip:** Start with Render.com free tier to test, then upgrade to Railway if you need always-on performance.
