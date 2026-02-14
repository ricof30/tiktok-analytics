# 🆕 Fresh Start Guide - Clean Deployment

This is the COMPLETE and CORRECT version with all files needed.

## 📦 What's Included

✅ **Extension Files:**
- `manifest.json` - Extension configuration
- `content.js` - Auto-injects region on TikTok (with correct API URL)
- `popup.js` - Extension popup (with correct API URL)
- `popup.html` - Extension UI
- `background.js` - Background service worker
- Icon files (16, 48, 128)

✅ **Server Files:**
- `server.js` - **UPDATED** with proper Puppeteer scraping
- `package.json` - All dependencies
- `render.yaml` - Render.com configuration
- `render-build.sh` - Custom build script for Chromium

✅ **Documentation:**
- `README.md` - Complete guide
- `QUICK-DEPLOY.md` - 5-minute deployment
- `TROUBLESHOOTING.md` - Common issues
- All other helpful docs

---

## 🚀 Quick Deploy (10 Minutes)

### Step 1: Create New GitHub Repo (2 min)

1. Go to https://github.com/new
2. Name: `tiktok-analytics-v2` (or any name)
3. **Public** repository
4. ✅ Check "Add a README file"
5. Click **"Create repository"**

### Step 2: Upload Files (2 min)

**Method A: Via GitHub Website (Easiest)**
1. Extract this zip file
2. Go to your new repo
3. Click **"Add file"** → **"Upload files"**
4. Drag ALL extracted files (not the folder, just the files inside)
5. Commit message: "Initial commit"
6. Click **"Commit changes"**

**Method B: Via Git**
```bash
cd path/to/extracted/folder
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/tiktok-analytics-v2.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Render (1 min setup + 5 min deploy)

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** → Select your repo
4. Configure:
   - **Name:** `tiktok-analytics-v2`
   - **Environment:** `Node`
   - **Build Command:** `bash render-build.sh`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
5. Click **"Create Web Service"**
6. **Wait 5-7 minutes** for deployment

### Step 4: Get Your URL

After deployment, Render gives you a URL like:
```
https://tiktok-analytics-v2.onrender.com
```

**Save this URL!** You'll need it for the extension.

### Step 5: Update Extension Files (Only if URL is different)

The extension files already have a placeholder URL. If your Render URL is different:

**Edit these 2 files:**

`content.js` (line 5):
```javascript
const API_BASE_URL = 'https://YOUR-URL.onrender.com';
```

`popup.js` (line 5):
```javascript
const API_BASE_URL = 'https://YOUR-URL.onrender.com';
```

Replace with your actual Render URL.

### Step 6: Install Extension (1 min)

1. Go to `chrome://extensions/`
2. Enable **"Developer mode"**
3. Click **"Load unpacked"**
4. Select the extracted folder
5. Done! ✅

---

## ✅ Test Everything

### Test 1: Server Health
Open in browser:
```
https://YOUR-URL.onrender.com/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### Test 2: API Endpoint
```
https://YOUR-URL.onrender.com/api/user-region?username=khaby.lame
```

Should return JSON with region data (NOT HTML)!

### Test 3: Extension on TikTok
1. Go to: `https://www.tiktok.com/@khaby.lame`
2. Wait 3-5 seconds
3. Region info appears under Follow button! 🎉

### Test 4: Check Render Logs
In Render dashboard → Logs, you should see:
```
Typed username: khaby.lame
Clicked Fetch Data button
Results loaded
Region data extracted: { country: 'Italy', ... }
```

---

## 🎯 What This Version Has

### ✅ Fixed Issues:
- Server properly scrapes TikTok User Finder site
- Uses correct element selectors (#usernameInput, #fetchButton)
- Waits for results to load before scraping
- Includes 80+ country code mappings
- Better error handling
- Proper logging for debugging

### ✅ Features:
- Auto-displays region on TikTok profiles
- Beautiful gradient UI
- Loading animations
- Caching for faster repeated visits
- Works on profile navigation
- Deployed server (no localhost needed)

---

## 📋 File Checklist

Make sure you have ALL these files:
- [ ] server.js (with #usernameInput code)
- [ ] package.json
- [ ] render.yaml
- [ ] render-build.sh
- [ ] manifest.json
- [ ] content.js
- [ ] popup.js
- [ ] popup.html
- [ ] background.js
- [ ] Icon files (icon16, icon48, icon128)

---

## 🐛 If Something Goes Wrong

### Server returns HTML instead of JSON?
- Wait 5 minutes after deployment
- Check Render logs for errors
- Make sure render-build.sh executed
- Look for "Typed username" in logs

### Extension not showing region?
- Check browser console (F12)
- Verify API URL in content.js and popup.js
- Make sure server is awake (first request = 30 sec)
- Try different TikTok profile

### Can't find files after extraction?
- Make sure you extracted the ZIP
- All files should be in ONE folder together
- Don't upload nested folders to GitHub

---

## 💡 Pro Tips

1. **Keep server awake:** Use UptimeRobot.com (free) to ping your server every 5 minutes
2. **Test with these profiles:**
   - @khaby.lame (Italy)
   - @charlidamelio (United States)
   - @marypenky (United Kingdom)
3. **Check logs regularly** to see what's happening
4. **First request is slow** - Render free tier sleeps after 15 min

---

## 📞 Need Help?

1. Check Render logs first
2. Read TROUBLESHOOTING.md
3. Verify all files are uploaded to GitHub
4. Make sure API URL is correct in extension files

---

**This is the clean, working version. Everything should work perfectly!** ✅

Deploy time: ~10 minutes
First region appears on TikTok: ~1 minute after deployment

**Let's go! 🚀**
