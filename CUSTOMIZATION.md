# Customization Guide for omar-thing.site Integration

This guide will help you customize the Puppeteer scraper to work with the actual structure of omar-thing.site.

## 🔍 Step 1: Inspect omar-thing.site

Before customizing the code, you need to understand the website's structure:

1. Open your browser and navigate to `https://omar-thing.site`
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Look for how the website displays user region data

## 🎯 Step 2: Identify the URL Pattern

Determine how the website structures URLs for user lookups:

### Common URL patterns:
```
https://omar-thing.site/user/USERNAME
https://omar-thing.site/profile?username=USERNAME
https://omar-thing.site/analytics/USERNAME
https://omar-thing.site/?user=USERNAME
```

Update this in `server.js`:
```javascript
// Line ~37 in server.js
const targetUrl = `https://omar-thing.site/YOUR_URL_PATTERN/${username}`;
```

## 🏷️ Step 3: Find the Data Selectors

Use Chrome DevTools to find the CSS selectors or XPath for region data:

### Method 1: Using Element Inspector
1. Right-click on the country/region/city text on the page
2. Select "Inspect" or "Inspect Element"
3. Note the class name, id, or data attribute

### Example HTML structures you might find:

#### Example 1: Using Classes
```html
<div class="user-location">
  <span class="country">United States</span>
  <span class="region">California</span>
  <span class="city">Los Angeles</span>
</div>
```

**Corresponding selectors:**
```javascript
const country = document.querySelector('.country')?.textContent?.trim();
const region = document.querySelector('.region')?.textContent?.trim();
const city = document.querySelector('.city')?.textContent?.trim();
```

#### Example 2: Using IDs
```html
<div id="location-data">
  <p id="user-country">United States</p>
  <p id="user-region">California</p>
  <p id="user-city">Los Angeles</p>
</div>
```

**Corresponding selectors:**
```javascript
const country = document.getElementById('user-country')?.textContent?.trim();
const region = document.getElementById('user-region')?.textContent?.trim();
const city = document.getElementById('user-city')?.textContent?.trim();
```

#### Example 3: Using Data Attributes
```html
<div class="location-info">
  <span data-location="country">United States</span>
  <span data-location="state">California</span>
  <span data-location="city">Los Angeles</span>
</div>
```

**Corresponding selectors:**
```javascript
const country = document.querySelector('[data-location="country"]')?.textContent?.trim();
const region = document.querySelector('[data-location="state"]')?.textContent?.trim();
const city = document.querySelector('[data-location="city"]')?.textContent?.trim();
```

#### Example 4: Nested Structure
```html
<div class="user-profile">
  <div class="demographics">
    <div class="location">
      <label>Country:</label>
      <span>United States</span>
    </div>
    <div class="location">
      <label>State:</label>
      <span>California</span>
    </div>
  </div>
</div>
```

**Corresponding selectors:**
```javascript
const locationDivs = document.querySelectorAll('.location');
const country = Array.from(locationDivs)
  .find(div => div.querySelector('label')?.textContent === 'Country:')
  ?.querySelector('span')?.textContent?.trim();
```

## 🔧 Step 4: Update server.js

Edit the `page.evaluate()` function in `server.js` (around line 50):

```javascript
const regionData = await page.evaluate(() => {
  // REPLACE THESE SELECTORS WITH YOUR ACTUAL SELECTORS
  
  const country = document.querySelector('.YOUR-COUNTRY-SELECTOR')?.textContent?.trim();
  const region = document.querySelector('.YOUR-REGION-SELECTOR')?.textContent?.trim();
  const city = document.querySelector('.YOUR-CITY-SELECTOR')?.textContent?.trim();
  
  return {
    country: country || 'Unknown',
    region: region || 'Unknown',
    city: city || 'Unknown',
    coordinates: null,
    timezone: null
  };
});
```

## 📦 Step 5: Handle JSON/API Responses

Some websites load data via JavaScript and store it in JSON:

### Check for JSON in script tags:
```javascript
const jsonData = document.querySelector('script[type="application/json"]');
if (jsonData) {
  const data = JSON.parse(jsonData.textContent);
  return data.location; // or however the data is structured
}
```

### Check for data in JavaScript variables:
```javascript
// If the page has: window.userData = {...}
const userData = window.userData;
if (userData && userData.location) {
  return userData.location;
}
```

### Check for React/Vue data:
```javascript
// Look for data in __NEXT_DATA__ or __NUXT__
const nextData = document.getElementById('__NEXT_DATA__');
if (nextData) {
  const data = JSON.parse(nextData.textContent);
  return data.props.pageProps.location;
}
```

## 🎭 Step 6: Handle Dynamic Content

If the content loads via AJAX after page load:

### Wait for specific elements:
```javascript
// In server.js, before page.evaluate()
await page.waitForSelector('.country-name', { timeout: 10000 });
```

### Wait for network to be idle:
```javascript
await page.goto(targetUrl, {
  waitUntil: 'networkidle0', // Wait until no network connections for 500ms
  timeout: 30000
});
```

### Wait for custom condition:
```javascript
await page.waitForFunction(
  () => document.querySelector('.country-name')?.textContent?.length > 0,
  { timeout: 10000 }
);
```

## 🧪 Step 7: Test Your Changes

1. Save your changes to `server.js`
2. Restart the server: `npm start`
3. Test with a known username:
```bash
curl "http://localhost:3000/api/user-region?username=testuser"
```

## 🐛 Debugging Tips

### Enable screenshots:
```javascript
// In server.js, after page.evaluate()
await page.screenshot({ 
  path: `debug-${username}.png`, 
  fullPage: true 
});
```

### Log the page content:
```javascript
const content = await page.content();
console.log('Page HTML:', content);
```

### Check console logs:
```javascript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

### Enable visible browser:
```javascript
// In server.js, change:
browser = await puppeteer.launch({
  headless: false, // Set to false to see the browser
  // ...
});
```

## 📝 Common Issues

### Issue: "Element not found"
**Solution**: The selector is wrong. Use Chrome DevTools to verify the correct selector.

### Issue: "Timeout waiting for selector"
**Solution**: The element loads slowly or doesn't exist. Increase timeout or use different wait strategy.

### Issue: "Cannot read property of null"
**Solution**: Add optional chaining (`?.`) to all selector queries.

### Issue: "Data is in wrong format"
**Solution**: Add `.trim()` to remove whitespace, and add parsing logic for formatted numbers.

## 🎨 Example: Complete Custom Implementation

Here's a complete example for a hypothetical website structure:

```javascript
const regionData = await page.evaluate(() => {
  // Try multiple methods to find the data
  
  // Method 1: Check for JSON data
  try {
    const scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (scriptTag) {
      const data = JSON.parse(scriptTag.textContent);
      if (data.address) {
        return {
          country: data.address.addressCountry,
          region: data.address.addressRegion,
          city: data.address.addressLocality,
          coordinates: {
            lat: data.geo?.latitude,
            lng: data.geo?.longitude
          }
        };
      }
    }
  } catch (e) {
    console.error('JSON parsing failed:', e);
  }
  
  // Method 2: Check for meta tags
  const countryMeta = document.querySelector('meta[property="location:country"]');
  if (countryMeta) {
    return {
      country: countryMeta.getAttribute('content'),
      region: document.querySelector('meta[property="location:region"]')?.getAttribute('content'),
      city: document.querySelector('meta[property="location:city"]')?.getAttribute('content')
    };
  }
  
  // Method 3: Standard HTML selectors
  return {
    country: document.querySelector('.location-country')?.textContent?.trim() || 'Unknown',
    region: document.querySelector('.location-region')?.textContent?.trim() || 'Unknown',
    city: document.querySelector('.location-city')?.textContent?.trim() || 'Unknown',
    coordinates: null
  };
});
```

## 🚀 Next Steps

After customizing for omar-thing.site:

1. Test with multiple users
2. Handle edge cases (missing data, errors)
3. Add rate limiting if needed
4. Consider caching frequently requested users
5. Add logging for monitoring

## 📞 Need Help?

If you're stuck:
1. Check the website's HTML source
2. Look for API calls in the Network tab
3. Try different selector strategies
4. Consider reaching out to the website owner for API access

---

Remember: Web scraping should be done responsibly and in accordance with the website's terms of service.
