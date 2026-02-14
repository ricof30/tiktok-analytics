# 🚀 Quick Deploy to Render.com (5 Minutes)

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/tiktok-analytics.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to https://render.com and sign up (free)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your repository
5. Configure:
   - **Name:** `tiktok-analytics-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
6. Click "Create Web Service"
7. Wait 2-3 minutes for deployment

### Step 3: Get Your URL
Render will give you a URL like:
```
https://tiktok-analytics-api.onrender.com
```

### Step 4: Update Extension
1. Open `popup.js` in your extension folder
2. Find line 5:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000';
   ```
3. Change to your Render URL:
   ```javascript
   const API_BASE_URL = 'https://tiktok-analytics-api.onrender.com';
   ```
4. Save the file
5. Reload the extension in Chrome (go to `chrome://extensions/` and click reload)

### Step 5: Test
1. Go to a TikTok profile
2. Click the extension
3. Click "Fetch User Region"
4. Done! ✅

---

## Option 2: Deploy via Render Dashboard (No GitHub)

### Step 1: Create Render Account
Go to https://render.com and sign up

### Step 2: Prepare Files
Make sure you have these files ready:
- `server.js`
- `package.json`
- `render.yaml` (optional but helpful)

### Step 3: Deploy
1. Click "New +" → "Web Service"
2. Choose "Build and deploy from a Git repository" OR "Deploy an existing image from a registry"
3. If no Git, you'll need to:
   - Create a GitHub repo first (see Option 1)
   - Or use Render's "Deploy from URL" feature

**Note:** Render works best with Git repositories. GitHub deployment is recommended.

---

## ⚡ Even Faster: Use the Deploy Button

I can create a "Deploy to Render" button for you. Add this to your README:

```markdown
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
```

---

## 🔧 After Deployment Checklist

- [ ] Deployment successful on Render
- [ ] Got deployment URL
- [ ] Updated `API_BASE_URL` in `popup.js`
- [ ] Reloaded extension in Chrome
- [ ] Tested health endpoint: `https://YOUR-URL.com/health`
- [ ] Tested with TikTok profile
- [ ] Updated selectors in `server.js` for omar-thing.site

---

## 💡 Tips

### Free Tier Limitations
- Server sleeps after 15 min of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month free

### Keep Server Awake (Optional)
Use a service like:
- **UptimeRobot** (https://uptimerobot.com) - Free, pings your server every 5 min
- **Cron-job.org** (https://cron-job.org) - Free cron jobs

Set it to ping: `https://YOUR-URL.com/health` every 10 minutes

### Upgrade if Needed
If you need always-on:
- **Render Starter:** $7/month (no sleep)
- **Railway:** $5/month (no sleep)

---

## 🐛 Common Issues

**"Application failed to respond"**
- Check build logs in Render dashboard
- Make sure `npm install` succeeded
- Verify `package.json` has all dependencies

**"Module not found"**
- Run `npm install` locally first to verify package.json is correct
- Check Render build logs

**Extension still says "localhost:3000"**
- Make sure you updated `popup.js` with new URL
- Reload the extension in Chrome
- Clear browser cache

---

## 📞 Need Help?

1. Check Render logs: Dashboard → Your Service → Logs
2. Test health endpoint in browser
3. Check browser console for errors
4. See TROUBLESHOOTING.md

---

**Most common mistake:** Forgetting to update `API_BASE_URL` in `popup.js` after deployment!
