# 🎉 Updated Version - Auto Region Display

## ✨ What's New

### 1. **Automatic Region Detection** 
- Extension now **automatically fetches and displays** region info when you visit a TikTok profile
- No need to click the extension icon anymore!

### 2. **On-Page Display**
- Region information appears **directly on the TikTok profile page**
- Shows up beautifully under the Follow button
- Includes country, country code, and language

### 3. **Uses Real Data Source**
- Scrapes from **TikTok User Finder** (omar-thing.site/tiktok.stormlikes.net)
- Gets actual region data like "🌍 United Kingdom (GB)"

### 4. **Deployed Server**
- Server is already deployed at: `https://tiktok-analytics-ksex.onrender.com`
- **No need to run localhost anymore!**

---

## 📸 How It Looks

When you visit a TikTok profile like `@marypenky`, you'll see:

```
┌─────────────────────────────┐
│  [Follow Button]            │
├─────────────────────────────┤
│ 🌍 REGION INFORMATION       │
│                             │
│ Country:  United Kingdom    │
│ Code:     GB                │
│ Language: English           │
└─────────────────────────────┘
```

Appears automatically with a smooth slide-in animation!

---

## 🚀 Installation (Super Easy)

### Step 1: Extract the Files
Extract the zip file to a folder

### Step 2: Load Extension
1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extracted folder

### Step 3: Test It!
1. Go to any TikTok profile (e.g., `https://www.tiktok.com/@marypenky`)
2. Wait 2-3 seconds
3. Region info appears automatically under the Follow button!

---

## ⚙️ How It Works

### Automatic Detection Flow:

```
1. You visit TikTok profile (@username)
       ↓
2. Extension detects username
       ↓
3. Sends username to deployed server
       ↓
4. Server uses Puppeteer to visit TikTok User Finder
       ↓
5. Server searches for the username
       ↓
6. Server scrapes region data (Country, Code, Language)
       ↓
7. Returns data to extension
       ↓
8. Extension injects beautiful display under Follow button
       ↓
9. You see the region info! 🎉
```

### Server URL:
```
https://tiktok-analytics-ksex.onrender.com
```

The server is already deployed and running, so everything works out of the box!

---

## 🎨 Features

✅ **Auto-fetch** - No manual clicking needed
✅ **On-page display** - Shows directly on TikTok
✅ **Beautiful UI** - Gradient design matches TikTok's style
✅ **Loading state** - Shows spinner while fetching
✅ **Cached results** - Faster on repeat visits
✅ **Works on navigation** - Updates when you browse between profiles
✅ **Deployed server** - No localhost setup needed

---

## 📝 Files Changed

### 1. **content.js** (Major Update)
- Added auto-fetch functionality
- Added on-page injection
- Beautiful gradient display
- Loading states
- Caching system

### 2. **server.js** (Updated)
- Now scrapes from TikTok User Finder (tiktok.stormlikes.net)
- Extracts country, code, and language
- Better error handling

### 3. **popup.js** (Updated)
- Uses deployed server URL
- Still works as backup interface

### 4. **manifest.json** (Same)
- All permissions already in place

---

## 🔧 Configuration

### Server URL
Both `content.js` and `popup.js` use:
```javascript
const API_BASE_URL = 'https://tiktok-analytics-ksex.onrender.com';
```

If you redeploy the server, update this URL in both files.

### Styling
Want to change colors? Edit the `injectRegionDisplay()` function in `content.js`:
```javascript
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

---

## 🐛 Troubleshooting

### Region Not Appearing?

**Check 1: Are you on a profile page?**
- URL must be: `https://www.tiktok.com/@username`
- Not on the For You page

**Check 2: Open Browser Console**
- Press F12
- Look for errors
- Should see: "Auto-fetching region for: username"

**Check 3: Check Server**
- Visit: https://tiktok-analytics-ksex.onrender.com/health
- Should return: `{"status":"ok"}`

**Check 4: Wait a moment**
- First request after server sleep takes ~30 seconds
- Render free tier wakes up slowly

### "Could not fetch region data"

This means:
- Server is down or sleeping
- TikTok User Finder site changed structure
- Network issue

**Solution:**
- Wait 30 seconds and refresh
- Check if server is awake: visit `/health` endpoint

### Display Looks Wrong?

TikTok's layout changes frequently. If the display appears in wrong place:

1. Open `content.js`
2. Find the `injectRegionDisplay()` function
3. Update the selector:
```javascript
const followButtonContainer = document.querySelector('[data-e2e="follow-button"]')?.parentElement;
```

Try different selectors if TikTok changed their HTML.

---

## 🎯 Testing

### Test Profiles:
- https://www.tiktok.com/@marypenky (GB)
- https://www.tiktok.com/@charlidamelio (US)
- https://www.tiktok.com/@khaby.lame (IT)

Visit these profiles and watch the region info appear!

---

## 💡 Tips

### Keep Server Awake
Free tier sleeps after 15 minutes. Use UptimeRobot:
1. Sign up at https://uptimerobot.com (free)
2. Add monitor: `https://tiktok-analytics-ksex.onrender.com/health`
3. Check every 5 minutes
4. Server stays awake!

### Cache Clearing
Region data is cached in memory. To clear:
1. Reload the extension
2. Or close and reopen Chrome

### Popup Still Works
The popup interface still works if you prefer:
- Click extension icon
- Click "Fetch User Region"
- View in popup window

---

## 📊 What Data Is Collected?

The extension scrapes these fields from TikTok User Finder:
- **Country** (e.g., "United Kingdom")
- **Country Code** (e.g., "GB")
- **Language** (e.g., "English")

No personal data is stored or transmitted except the public username.

---

## 🔒 Privacy & Security

- ✅ Only scrapes public information
- ✅ No data stored on server
- ✅ No tracking or analytics
- ✅ Open source - you can review all code
- ✅ Uses HTTPS for all requests

---

## 🚀 Next Steps

Want to improve it?
- Add more data fields
- Change the styling
- Add animations
- Cache to localStorage
- Add settings panel

All the code is yours to customize!

---

## ❓ Need Help?

1. Check TROUBLESHOOTING.md
2. Check browser console (F12)
3. Test server: `/health` endpoint
4. Check Render logs if you own the server

---

**Enjoy your automatic TikTok region tracker! 🎉**

Made with ❤️ for TikTok analytics
