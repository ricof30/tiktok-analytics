# Fix Render.com Deployment Error

The build failed because Puppeteer's Chrome download timed out. Here are 3 solutions:

## ✅ Solution 1: Use Updated Files (Easiest)

I've updated the files to fix this. Follow these steps:

### 1. Update Your Local Files

Replace these files in your project with the new versions:
- `package.json` (added skipDownload config)
- `render.yaml` (uses custom build script)
- `render-build.sh` (new file - installs system Chromium)
- `server.js` (updated Chrome path)

### 2. Commit and Push

```bash
git add .
git commit -m "Fix Render deployment - use system Chromium"
git push
```

### 3. Redeploy on Render

Render will automatically detect the push and redeploy. Or manually trigger:
- Go to your Render dashboard
- Click "Manual Deploy" → "Clear build cache & deploy"

---

## ✅ Solution 2: Configure Environment Variables (Quick Fix)

If you don't want to update files:

### In Render Dashboard:

1. Go to your service → "Environment"
2. Add these variables:

```
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
PUPPETEER_EXECUTABLE_PATH = /usr/bin/chromium
```

3. Update Build Command to:
```bash
apt-get update && apt-get install -y chromium && npm install --omit=optional
```

4. Click "Save Changes" and redeploy

---

## ✅ Solution 3: Use Puppeteer-Core Instead (Alternative)

This is lighter but requires more changes:

### 1. Update package.json dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "puppeteer-core": "^21.6.1",
    "@sparticuz/chromium": "^121.0.0",
    "cors": "^2.8.5",
    "axios": "^1.6.2"
  }
}
```

### 2. Update server.js imports:

```javascript
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

// In the launch section:
browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
```

---

## 🎯 Recommended: Solution 1

**Solution 1 is the best** - it uses system Chromium which is:
- ✅ Faster to install
- ✅ More reliable
- ✅ No download timeouts
- ✅ Works on Render's free tier

---

## 🔍 Verify the Fix

After redeploying, check:

1. **Build logs should show:**
   ```
   Installing system Chromium...
   Build complete!
   ```

2. **Test the health endpoint:**
   ```
   https://your-app.onrender.com/health
   ```
   
   Should return:
   ```json
   {"status":"ok","timestamp":"..."}
   ```

3. **Test the API:**
   ```
   https://your-app.onrender.com/api/user-region?username=test
   ```

---

## 🐛 Still Having Issues?

### Check Build Logs

In Render dashboard → Logs → Build logs

Look for:
- `chromium installed successfully`
- `npm install` completed
- No timeout errors

### Common Issues:

**"chromium: command not found"**
- Build script didn't run properly
- Make sure `render-build.sh` has execute permissions
- Or use Solution 2 (environment variables)

**"Browser not found"**
- Check `PUPPETEER_EXECUTABLE_PATH` is set correctly
- Try these paths: `/usr/bin/chromium`, `/usr/bin/chromium-browser`, `/usr/bin/google-chrome`

**Build still timing out**
- Try "Clear build cache & deploy"
- Use Solution 3 (puppeteer-core) as last resort

---

## 💡 Why This Happens

Render's free tier has:
- Limited build time (15 min)
- Slower disk I/O
- Network restrictions

Puppeteer downloading Chrome (~200MB) often times out. Using system Chromium avoids this.

---

## 📋 Quick Checklist

- [ ] Updated package.json with skipDownload
- [ ] Created render-build.sh file
- [ ] Updated render.yaml with new build command
- [ ] Updated server.js with correct Chrome path
- [ ] Committed and pushed changes
- [ ] Redeployed on Render
- [ ] Checked build logs for success
- [ ] Tested health endpoint
- [ ] Updated popup.js with deployed URL

---

## 🚀 Alternative: Try Railway Instead

If Render continues to have issues, **Railway.app** works better with Puppeteer:

1. Go to https://railway.app
2. Connect GitHub repo
3. Railway auto-deploys (no special config needed)
4. $5/month but more reliable for Puppeteer

Railway handles Puppeteer better out of the box.

---

Need more help? Check the Render docs: https://render.com/docs/web-services
