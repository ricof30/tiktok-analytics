const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const regionCache = new Map();
const CACHE_DURATION = 3600000;

const COUNTRY_MAP = {
  US: 'United States', GB: 'United Kingdom', CA: 'Canada', AU: 'Australia',
  DE: 'Germany', FR: 'France', IT: 'Italy', ES: 'Spain', MX: 'Mexico',
  BR: 'Brazil', JP: 'Japan', KR: 'South Korea', CN: 'China', IN: 'India',
  PH: 'Philippines', ID: 'Indonesia', TH: 'Thailand', VN: 'Vietnam',
  MY: 'Malaysia', SG: 'Singapore', NL: 'Netherlands', SE: 'Sweden',
  NO: 'Norway', DK: 'Denmark', FI: 'Finland', PL: 'Poland', RU: 'Russia',
  TR: 'Turkey', SA: 'Saudi Arabia', AE: 'United Arab Emirates',
  ZA: 'South Africa', EG: 'Egypt', NG: 'Nigeria', AR: 'Argentina',
  CL: 'Chile', CO: 'Colombia', PE: 'Peru', NZ: 'New Zealand',
  IE: 'Ireland', PT: 'Portugal', GR: 'Greece', CZ: 'Czech Republic',
  RO: 'Romania', HU: 'Hungary', AT: 'Austria', CH: 'Switzerland',
  BE: 'Belgium', UA: 'Ukraine', IL: 'Israel', PK: 'Pakistan',
  BD: 'Bangladesh', TW: 'Taiwan', HK: 'Hong Kong', IT: 'Italy',
};

function formatNum(n) {
  if (n === null || n === undefined) return 'N/A';
  const num = typeof n === 'string' ? parseInt(n, 10) : n;
  if (isNaN(num) || num < 0) return 'N/A';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return String(num);
}

async function scrapeOmarThing(username) {
  let browser;
  try {
    console.log(`[Playwright] Scraping omar-thing.site for: ${username}`);

    // Set browser path for Render.com
    if (process.env.PLAYWRIGHT_BROWSERS_PATH === undefined) {
      process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/render/.cache/ms-playwright';
    }

    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process', '--no-zygote']
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
      // Block images/fonts to speed up
      extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' }
    });

    await context.route('**/*.{png,jpg,jpeg,gif,webp,svg,woff,woff2,ttf,mp4,mp3}', route => route.abort());

    const page = await context.newPage();

    await page.goto('https://omar-thing.site/', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('[Playwright] Page loaded');

    // Fill username and click fetch
    await page.fill('#usernameInput', username);
    await page.click('#fetchButton');
    console.log('[Playwright] Clicked Fetch Data');

    // Wait for results — poll for nickname or region to appear
    let found = false;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(1000);
      found = await page.evaluate(() => {
        const body = document.body.innerText;
        if (/Region:\s*[A-Za-z]/.test(body)) return true;
        const nick = document.querySelector('#resultNickname, .result-nickname');
        if (nick && nick.textContent.trim() && nick.textContent.trim() !== '-') return true;
        return false;
      });
      if (found) { console.log(`[Playwright] Results found after ${i + 1}s`); break; }
      console.log(`[Playwright] Waiting... ${i + 1}/20`);
    }

    await page.waitForTimeout(1000);

    const data = await page.evaluate(() => {
      const bodyText = document.body.innerText;

      const getEl = (...sels) => {
        for (const sel of sels) {
          const el = document.querySelector(sel);
          if (el) { const t = el.textContent.trim(); if (t && t !== '-') return t; }
        }
        return null;
      };

      const reMatch = (pattern) => {
        const m = bodyText.match(pattern);
        return m ? m[1].trim() : null;
      };

      const nickname  = getEl('#resultNickname', '.result-nickname')  || reMatch(/Nickname[:\s]+([^\n]+)/i);
      const region    = getEl('#resultRegion',   '.result-region')    || reMatch(/Region:\s*([^\n]+)/i);
      const language  = getEl('#resultLanguage', '.result-language')  || reMatch(/Language:\s*([^\n]+)/i);
      const followers = getEl('#resultFollowers','.result-followers') || reMatch(/Followers[:\s]+([0-9,KMB.]+)/i);
      const following = getEl('#resultFollowing','.result-following') || reMatch(/Following[:\s]+([0-9,KMB.]+)/i);
      const likes     = getEl('#resultHearts','#resultLikes')         || reMatch(/(?:Hearts|Likes)[:\s]+([0-9,KMB.]+)/i);
      const userId    = getEl('#resultUserId','#resultID')            || reMatch(/User\s*ID[:\s]+([0-9]+)/i);

      let country = null, countryCode = null;
      if (region) {
        const m1 = region.match(/^(.+?)\s*\(([A-Z]{2})\)\s*$/);
        const m2 = region.match(/^([A-Z]{2})$/);
        if (m1) { country = m1[1].trim(); countryCode = m1[2]; }
        else if (m2) { countryCode = m2[1]; country = m2[1]; }
        else { country = region; }
      }

      return {
        nickname, region, country, countryCode, language,
        followers, following, likes, userId,
        hasData: !!(nickname && nickname !== '-')
      };
    });

    console.log('[Playwright] Extracted:', JSON.stringify(data));

    if (!data.hasData) {
      return { success: false, error: 'User not found or site returned no results', username, timestamp: new Date().toISOString() };
    }

    return {
      success: true, username,
      data: {
        nickname:    data.nickname    || 'N/A',
        country:     COUNTRY_MAP[data.countryCode] || data.country || 'Not available',
        countryCode: data.countryCode || 'N/A',
        region:      data.region      || 'Not available',
        language:    data.language    || 'Unknown',
        followers:   data.followers   || 'N/A',
        following:   data.following   || 'N/A',
        likes:       data.likes       || 'N/A',
        userId:      data.userId      || 'N/A',
      },
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    console.error('[Playwright] Error:', err.message);
    return { success: false, error: err.message, username, timestamp: new Date().toISOString() };
  } finally {
    if (browser) { await browser.close(); console.log('[Playwright] Browser closed'); }
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/api/user-region', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ success: false, error: 'username parameter is required' });

  const clean = username.replace('@', '').trim();
  const cacheKey = `region_${clean}`;
  const cached = regionCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[Cache] Hit for ${clean}`);
    return res.json(cached.data);
  }

  const result = await scrapeOmarThing(clean);
  if (result.success) regionCache.set(cacheKey, { data: result, timestamp: Date.now() });
  return res.status(result.success ? 200 : 500).json(result);
});

app.post('/api/batch-region', async (req, res) => {
  const { usernames } = req.body;
  if (!usernames || !Array.isArray(usernames))
    return res.status(400).json({ success: false, error: 'usernames array is required' });
  if (usernames.length > 5)
    return res.status(400).json({ success: false, error: 'Maximum 5 usernames per batch' });

  const results = [];
  for (const u of usernames) results.push(await scrapeOmarThing(u.replace('@', '').trim()));
  return res.json({ success: true, results });
});

app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.get('/', (_, res) => res.json({
  name: 'TikTok Analytics API', version: '4.0.0',
  method: 'Playwright → omar-thing.site',
  endpoints: {
    'GET /api/user-region?username=USERNAME': 'Get region & profile data',
    'POST /api/batch-region': 'Batch lookup (max 5)',
    'GET /health': 'Health check'
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 TikTok Analytics API v4 (Playwright) running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT',  () => process.exit(0));
