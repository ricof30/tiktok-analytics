# TikTok Analytics Extension

A Chrome extension that fetches TikTok user region data from omar-thing.site using Puppeteer.

## 📋 Features

- ✅ Automatically detects TikTok user profiles
- ✅ Extracts username, followers, following, and likes
- ✅ Fetches user region data (country, region, city) from omar-thing.site
- ✅ Beautiful gradient UI with modern design
- ✅ Caching mechanism for faster responses
- ✅ Batch processing support for multiple users

## 🏗️ Architecture

The project consists of two main components:

1. **Chrome Extension** (Frontend)
   - Content script that runs on TikTok pages
   - Popup interface for displaying user info and region data
   - Background service worker for message handling

2. **Node.js API Server** (Backend)
   - Express.js server with Puppeteer for web scraping
   - Fetches region data from omar-thing.site
   - Caching layer for improved performance

## 📦 Installation

### Prerequisites

- Node.js 16+ and npm installed
- Google Chrome browser
- Basic knowledge of Chrome extensions

### Step 1: Set Up the Backend Server

1. Navigate to the project directory:
```bash
cd tiktok-analytics-extension
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Step 2: Install the Chrome Extension

1. Open Google Chrome and go to `chrome://extensions/`

2. Enable "Developer mode" (toggle in top-right corner)

3. Click "Load unpacked"

4. Select the extension folder (the folder containing `manifest.json`)

5. The extension should now appear in your extensions list

6. Pin the extension to your toolbar for easy access

## 🚀 Usage

### Basic Usage

1. Navigate to any TikTok user profile (e.g., `https://www.tiktok.com/@username`)

2. Click the extension icon in your Chrome toolbar

3. The popup will automatically detect the user and display their information

4. Click "Fetch User Region" to get region data from omar-thing.site

5. View the region information displayed in the popup

### API Endpoints

The backend server provides the following endpoints:

#### Get Single User Region
```bash
GET http://localhost:3000/api/user-region?username=USERNAME
```

Response:
```json
{
  "success": true,
  "username": "username",
  "data": {
    "country": "United States",
    "region": "California",
    "city": "Los Angeles",
    "coordinates": null,
    "timezone": null
  },
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

#### Batch User Region Request
```bash
POST http://localhost:3000/api/batch-region
Content-Type: application/json

{
  "usernames": ["user1", "user2", "user3"]
}
```

#### Health Check
```bash
GET http://localhost:3000/health
```

## 🔧 Configuration

### Customizing the Scraper

The Puppeteer scraper in `server.js` needs to be customized based on the actual HTML structure of omar-thing.site. Update the selectors in the `page.evaluate()` function:

```javascript
const regionData = await page.evaluate(() => {
  // Update these selectors based on omar-thing.site's actual structure
  const country = document.querySelector('.your-country-selector')?.textContent?.trim();
  const region = document.querySelector('.your-region-selector')?.textContent?.trim();
  const city = document.querySelector('.your-city-selector')?.textContent?.trim();
  
  return { country, region, city };
});
```

### Updating the Extension

If you need to change the API endpoint URL in the extension:

1. Edit `popup.js`
2. Update the `fetch()` URL to point to your server:
```javascript
const response = await fetch(`http://your-server-url:3000/api/user-region?username=${username}`);
```

## 📁 Project Structure

```
tiktok-analytics-extension/
├── manifest.json          # Extension manifest
├── content.js            # Content script (runs on TikTok pages)
├── background.js         # Background service worker
├── popup.html           # Extension popup UI
├── popup.js             # Popup logic
├── server.js            # Node.js + Puppeteer backend
├── package.json         # Node.js dependencies
├── .env.example         # Environment variables template
├── README.md           # This file
└── icons/              # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🎨 Customization

### Changing the UI Theme

Edit the CSS in `popup.html` to customize colors and styles:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adding More Data Fields

1. Update the Puppeteer scraper in `server.js` to extract additional data
2. Modify `popup.html` to display the new fields
3. Update `popup.js` to handle the new data

## 🐛 Troubleshooting

### Extension Not Detecting User

- Make sure you're on a TikTok user profile page (URL contains `/@username`)
- Refresh the page and try again
- Check the browser console for errors (F12 → Console)

### API Server Not Responding

- Verify the server is running: `http://localhost:3000/health`
- Check if the port 3000 is available
- Review server logs for errors

### Puppeteer Issues

- Install Chromium dependencies on Linux:
```bash
sudo apt-get update
sudo apt-get install -y chromium-browser
```

- For headless Chrome issues, try running with `headless: false` in `server.js`

### CORS Errors

- The server already has CORS enabled
- If you're hosting the server elsewhere, ensure CORS is properly configured
- Check browser console for specific CORS errors

## 🔐 Security Notes

- Never commit API keys or sensitive data to version control
- Use environment variables for configuration
- Validate and sanitize all user inputs
- Be respectful of rate limits and terms of service
- Consider adding authentication to your API endpoints

## 📝 Important Notes

1. **Website Structure**: The Puppeteer selectors in `server.js` are examples. You MUST update them to match the actual HTML structure of omar-thing.site.

2. **Rate Limiting**: The extension includes basic caching, but consider implementing more robust rate limiting for production use.

3. **Terms of Service**: Ensure you comply with TikTok's and omar-thing.site's terms of service when scraping data.

4. **Chrome Extension Limitations**: Chrome extensions cannot run Puppeteer directly. That's why we need a separate Node.js server.

## 🚀 Deployment

### Deploying the Backend

You can deploy the backend to:
- Heroku
- DigitalOcean
- AWS EC2
- Google Cloud Platform
- Any Node.js hosting service

Update the API URL in `popup.js` to point to your deployed server.

### Publishing the Extension

To publish to the Chrome Web Store:
1. Create icons (16x16, 48x48, 128x128)
2. Zip the extension folder
3. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. Pay the one-time $5 developer fee
5. Upload your extension

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note**: This extension is for educational purposes. Always respect website terms of service and rate limits when scraping data.
