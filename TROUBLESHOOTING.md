# Troubleshooting Guide

## Error: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

This error means the extension is trying to connect to the backend server but getting an HTML error page instead of JSON data.

### Solution Steps:

#### 1. Check if Backend Server is Running

Open a terminal and run:
```bash
cd /path/to/tiktok-analytics-extension
npm start
```

You should see:
```
🚀 TikTok Analytics API running on port 3000
📍 Health check: http://localhost:3000/health
📊 API endpoint: http://localhost:3000/api/user-region?username=USERNAME
```

#### 2. Test the Server

Open your browser and go to:
```
http://localhost:3000/health
```

You should see:
```json
{"status":"ok","timestamp":"2024-01-15T12:00:00.000Z"}
```

If you get "This site can't be reached" or a similar error, the server is not running.

#### 3. Check Server Logs

Look at the terminal where you ran `npm start`. Check for errors like:
- `Error: listen EADDRINUSE` - Port 3000 is already in use
- `Cannot find module` - Dependencies not installed (run `npm install`)
- `SyntaxError` - There's a syntax error in server.js

#### 4. Test the API Endpoint

Try testing with a real username:
```bash
curl "http://localhost:3000/api/user-region?username=testuser"
```

Or open in browser:
```
http://localhost:3000/api/user-region?username=testuser
```

#### 5. Check Extension Permissions

Make sure the extension has permission to access localhost:
1. Open Chrome → Extensions → TikTok Analytics
2. Check that "Allow access to file URLs" is enabled (if needed)
3. Make sure the manifest.json includes localhost in host_permissions

## Common Issues and Solutions

### Issue: Port 3000 Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:** Either:
1. Kill the process using port 3000:
   ```bash
   # On Mac/Linux
   lsof -ti:3000 | xargs kill -9
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change the port in server.js and popup.js:
   ```javascript
   // server.js
   const PORT = 3001; // Change to different port
   
   // popup.js
   const apiUrl = `http://localhost:3001/api/user-region?username=...`;
   ```

### Issue: Dependencies Not Installed

**Error:** `Cannot find module 'express'` or similar

**Solution:**
```bash
cd /path/to/extension
npm install
```

### Issue: CORS Error

**Error:** `Access to fetch at 'http://localhost:3000' ... has been blocked by CORS policy`

**Solution:** The server already has CORS enabled. If you still see this:
1. Make sure server.js has the CORS middleware
2. Restart the server
3. Check browser console for specific CORS error

### Issue: omar-thing.site Selector Errors

**Error:** Server returns `{success: true, data: {country: "Unknown", region: "Unknown"}}`

**Solution:** You need to update the Puppeteer selectors in server.js:
1. Open omar-thing.site in your browser
2. Inspect the HTML structure (F12 → Elements)
3. Update the selectors in server.js around line 50
4. See CUSTOMIZATION.md for detailed instructions

### Issue: Extension Not Detecting User

**Problem:** Extension shows "Please navigate to a TikTok user profile first"

**Solution:**
1. Make sure you're on a TikTok profile page: `https://www.tiktok.com/@username`
2. The URL must contain `/@username` format
3. Refresh the page after loading the extension
4. Check browser console (F12) for errors

### Issue: Puppeteer Not Launching

**Error:** `Error: Failed to launch the browser process`

**Solution:**

**On Linux:**
```bash
sudo apt-get update
sudo apt-get install -y \
  gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 \
  libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 \
  libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
  libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
  libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 \
  libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates \
  fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

**On Mac/Windows:** Usually works out of the box with Puppeteer

### Issue: Network Request Failed

**Error:** `TypeError: Failed to fetch` or `NetworkError when attempting to fetch resource`

**Solution:**
1. Check if backend server is running
2. Verify the URL in popup.js is correct
3. Check your firewall isn't blocking localhost:3000
4. Try accessing http://localhost:3000/health in your browser

## Debugging Tips

### Enable Verbose Logging

**In popup.js:**
```javascript
// Check browser console (F12) for detailed logs
console.log('Debug info:', ...);
```

**In server.js:**
```javascript
// Server logs appear in the terminal
console.log('Request received:', req.query);
```

### Test API Independently

Use curl or Postman to test the API without the extension:
```bash
# Test health endpoint
curl http://localhost:3000/health

# Test user region endpoint
curl "http://localhost:3000/api/user-region?username=testuser"

# Test with verbose output
curl -v "http://localhost:3000/api/user-region?username=testuser"
```

### Check Browser Console

1. Open the extension popup
2. Right-click on the popup → Inspect
3. Check Console tab for errors
4. Check Network tab to see API requests

### Check Background Script

1. Go to `chrome://extensions/`
2. Find TikTok Analytics extension
3. Click "Inspect views: background page"
4. Check console for errors

### Enable Puppeteer Debugging

In server.js, change:
```javascript
browser = await puppeteer.launch({
  headless: false, // Show the browser
  devtools: true,   // Open DevTools
  slowMo: 100,      // Slow down by 100ms
  // ...
});
```

### Take Screenshots for Debugging

Uncomment in server.js:
```javascript
await page.screenshot({ 
  path: `debug-${username}.png`, 
  fullPage: true 
});
```

This saves a screenshot to help debug selector issues.

## Still Having Issues?

1. **Check all documentation:**
   - README.md - Complete setup guide
   - CUSTOMIZATION.md - Selector configuration
   - QUICKSTART.md - Quick setup

2. **Verify setup checklist:**
   - [ ] Node.js 16+ installed
   - [ ] Ran `npm install`
   - [ ] Server running (`npm start`)
   - [ ] Server accessible (http://localhost:3000/health)
   - [ ] Extension loaded in Chrome
   - [ ] On a TikTok profile page
   - [ ] Updated selectors in server.js for omar-thing.site

3. **Check the basics:**
   - Is Node.js installed? `node --version`
   - Are dependencies installed? Check `node_modules/` folder exists
   - Is server running? Check terminal output
   - Is port 3000 available? Try a different port

4. **Look at the logs:**
   - Server terminal output
   - Browser console (F12)
   - Background script console
   - Network tab in DevTools

## Quick Test Procedure

Run through these steps to isolate the issue:

```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start

# 3. In another terminal, test the API
curl http://localhost:3000/health

# 4. Test with a username
curl "http://localhost:3000/api/user-region?username=test"

# 5. Load extension in Chrome
# Go to chrome://extensions/ → Load unpacked

# 6. Navigate to a TikTok profile
# https://www.tiktok.com/@username

# 7. Click extension icon and test
```

If any step fails, that's where the problem is!

## Getting Help

When asking for help, provide:
1. Error message (full text)
2. Browser console output
3. Server terminal output
4. Steps you've already tried
5. Your operating system
6. Node.js version (`node --version`)

---

**Most common fix:** Make sure the backend server is running with `npm start` before using the extension!
