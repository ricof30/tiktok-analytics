# Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)
```bash
cd tiktok-analytics-extension
npm install
```

### Step 2: Customize for omar-thing.site (2 minutes)
1. Open `server.js` in your editor
2. Go to line ~37 and update the URL pattern:
   ```javascript
   const targetUrl = `https://omar-thing.site/YOUR_PATH/${username}`;
   ```
3. Go to line ~50 and update the selectors in `page.evaluate()`:
   ```javascript
   const country = document.querySelector('.YOUR-SELECTOR')?.textContent?.trim();
   ```
   
   **Not sure what selectors to use?** See [CUSTOMIZATION.md](CUSTOMIZATION.md) for detailed instructions.

### Step 3: Start the Server (30 seconds)
```bash
npm start
```

Server will run on `http://localhost:3000`

### Step 4: Load Extension in Chrome (30 seconds)
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select this folder
5. Done! 🎉

## ✅ Test It

1. Go to any TikTok user profile: `https://www.tiktok.com/@username`
2. Click the extension icon
3. Click "Fetch User Region"
4. View the results!

## 🔧 Important: Customization Required

The extension won't work correctly until you customize the Puppeteer selectors for omar-thing.site.

**See [CUSTOMIZATION.md](CUSTOMIZATION.md) for detailed instructions on:**
- Finding the correct URL pattern
- Identifying CSS selectors
- Handling dynamic content
- Debugging tips

## 📚 Full Documentation

- [README.md](README.md) - Complete setup and usage guide
- [CUSTOMIZATION.md](CUSTOMIZATION.md) - How to customize for omar-thing.site

## 🐛 Troubleshooting

**Extension not detecting user?**
- Ensure you're on a TikTok profile page (URL contains `/@username`)
- Refresh the page

**API not working?**
- Check if server is running: `http://localhost:3000/health`
- Update selectors in `server.js` for omar-thing.site

**Need help?**
- Check browser console for errors (F12)
- Check server logs
- Read the full [README.md](README.md)

## 🎯 Project Files

```
├── manifest.json       # Extension configuration
├── content.js         # Runs on TikTok pages
├── background.js      # Background tasks
├── popup.html         # Extension UI
├── popup.js          # Extension logic
├── server.js         # Puppeteer backend (⚠️ CUSTOMIZE THIS)
├── package.json      # Dependencies
└── README.md         # Full documentation
```

---

**Ready to customize?** → See [CUSTOMIZATION.md](CUSTOMIZATION.md)

**Need more details?** → See [README.md](README.md)
