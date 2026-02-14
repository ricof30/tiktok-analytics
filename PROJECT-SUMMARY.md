# TikTok Analytics Extension - Project Summary

## 🎯 What This Does

A Chrome extension that analyzes TikTok user profiles and fetches their geographic region data from omar-thing.site using Puppeteer for web scraping.

## 📦 What You Got

### Chrome Extension Files
- **manifest.json** - Extension configuration
- **content.js** - Runs on TikTok pages to extract user data
- **background.js** - Background service worker
- **popup.html** - Beautiful gradient UI 
- **popup.js** - Extension logic and API calls
- **icon files** - Extension icons (placeholder SVGs)

### Backend Server (Puppeteer)
- **server.js** - Node.js + Express + Puppeteer API
- **package.json** - Node dependencies

### Configuration
- **.env.example** - Environment variables template
- **.gitignore** - Git ignore rules
- **setup.sh** - Automated setup script

### Documentation
- **README.md** - Complete setup guide (MUST READ)
- **QUICKSTART.md** - 5-minute quick start
- **CUSTOMIZATION.md** - How to customize for omar-thing.site (CRITICAL)
- **ICONS-README.txt** - Instructions for creating proper icons

## ⚡ Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Customize server.js** for omar-thing.site (see CUSTOMIZATION.md)

3. **Start server:**
   ```bash
   npm start
   ```

4. **Load extension in Chrome:**
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select this folder

## ⚠️ CRITICAL: Customization Required

The extension **will not work** until you:

1. Update the URL pattern in `server.js` (line ~37) to match omar-thing.site's structure
2. Update the CSS selectors in `server.js` (line ~50) to extract region data

**See CUSTOMIZATION.md for step-by-step instructions.**

## 🏗️ Architecture

```
┌─────────────────┐
│  TikTok Page    │
│  (User Profile) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Content Script  │ ◄── Extracts username, followers, etc.
│   (content.js)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Popup UI       │ ◄── Displays data, triggers region fetch
│  (popup.html/js)│
└────────┬────────┘
         │ API Call
         ▼
┌─────────────────┐
│  Node.js Server │ ◄── Express + Puppeteer
│   (server.js)   │
└────────┬────────┘
         │ Scrapes
         ▼
┌─────────────────┐
│ omar-thing.site │ ◄── Returns region data
└─────────────────┘
```

## 🎨 Features

✅ Auto-detects TikTok user profiles
✅ Extracts user stats (followers, following, likes)
✅ Beautiful gradient UI with modern design
✅ Fetches region data via Puppeteer scraping
✅ Caching for improved performance
✅ Batch processing support
✅ Error handling and status indicators

## 📊 API Endpoints

### Single User
```
GET http://localhost:3000/api/user-region?username=USERNAME
```

### Batch Users
```
POST http://localhost:3000/api/batch-region
Body: { "usernames": ["user1", "user2"] }
```

### Health Check
```
GET http://localhost:3000/health
```

## 🔧 Main Files to Edit

1. **server.js** - Update Puppeteer selectors for omar-thing.site
2. **popup.js** - Change API endpoint if deploying server elsewhere
3. **manifest.json** - Update permissions if needed

## 📝 Important Notes

- **Chrome extensions cannot run Puppeteer directly** - that's why we need a separate Node.js server
- **The selectors in server.js are examples** - you must update them for omar-thing.site
- **Respect rate limits** and terms of service when scraping
- **Create proper PNG icons** before publishing to Chrome Web Store

## 🚀 Next Steps

1. Read [QUICKSTART.md](QUICKSTART.md) for setup
2. Follow [CUSTOMIZATION.md](CUSTOMIZATION.md) to configure for omar-thing.site
3. Test with a TikTok profile
4. Customize the UI if desired
5. Deploy the backend server (Heroku, DigitalOcean, etc.)
6. Update popup.js with your deployed server URL
7. Create proper PNG icons
8. Publish to Chrome Web Store

## 🐛 Troubleshooting

**Extension not working?**
→ Make sure you're on a TikTok profile page

**API errors?**
→ Check if server is running: `http://localhost:3000/health`

**No data returned?**
→ Update selectors in server.js (see CUSTOMIZATION.md)

**Need more help?**
→ Read the complete [README.md](README.md)

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Complete documentation |
| QUICKSTART.md | 5-minute setup guide |
| CUSTOMIZATION.md | How to customize for omar-thing.site |
| ICONS-README.txt | Icon creation instructions |

## 🎓 Learning Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Puppeteer Docs](https://pptr.dev/)
- [Express.js Docs](https://expressjs.com/)

## 📄 License

MIT License - Free to use and modify

---

**Built with ❤️ for TikTok analytics**

Need help? Check the documentation files or open an issue!
