// Content script that runs on TikTok pages
console.log('TikTok Analytics Extension: Content script loaded');

// API endpoint
const API_BASE_URL = 'https://tiktok-analytics-ksex.onrender.com';

// Cache for region data
const regionCache = {};

// Function to extract username from current TikTok page
function extractTikTokUsername() {
  const url = window.location.href;
  
  // Match TikTok user profile URLs like: https://www.tiktok.com/@username
  const userMatch = url.match(/tiktok\.com\/@([^/?]+)/);
  if (userMatch && userMatch[1]) {
    return userMatch[1];
  }
  
  // Alternative: Try to get from page elements
  const usernameElement = document.querySelector('[data-e2e="user-title"]');
  if (usernameElement) {
    return usernameElement.textContent.replace('@', '').trim();
  }
  
  return null;
}

// Function to extract additional user info from the page
function extractUserInfo() {
  const username = extractTikTokUsername();
  
  const userInfo = {
    username: username,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };
  
  // Try to get follower count
  const followersElement = document.querySelector('[data-e2e="followers-count"]');
  if (followersElement) {
    userInfo.followers = followersElement.textContent.trim();
  }
  
  // Try to get following count
  const followingElement = document.querySelector('[data-e2e="following-count"]');
  if (followingElement) {
    userInfo.following = followingElement.textContent.trim();
  }
  
  // Try to get likes count
  const likesElement = document.querySelector('[data-e2e="likes-count"]');
  if (likesElement) {
    userInfo.likes = likesElement.textContent.trim();
  }
  
  return userInfo;
}

// Function to fetch region data from API
async function fetchRegionData(username) {
  // Check cache first
  if (regionCache[username]) {
    console.log('Using cached region data for:', username);
    return regionCache[username];
  }
  
  try {
    console.log('Fetching region data for:', username);
    const response = await fetch(`${API_BASE_URL}/api/user-region?username=${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const regionData = data.data || data;
    
    // Cache the result
    regionCache[username] = regionData;
    
    return regionData;
  } catch (error) {
    console.error('Error fetching region data:', error);
    return null;
  }
}

// Function to create and inject region display element
function injectRegionDisplay(regionData) {
  // Remove existing region display if any
  const existingDisplay = document.getElementById('tiktok-region-display');
  if (existingDisplay) {
    existingDisplay.remove();
  }
  
  // Find the follow button container
  const followButtonContainer = document.querySelector('[data-e2e="follow-button"]')?.parentElement ||
                                document.querySelector('button[data-e2e="follow-button"]')?.parentElement ||
                                document.querySelector('[class*="follow"]')?.parentElement;
  
  if (!followButtonContainer) {
    console.log('Could not find follow button container');
    return;
  }
  
  // Create region display element
  const regionDisplay = document.createElement('div');
  regionDisplay.id = 'tiktok-region-display';
  regionDisplay.style.cssText = `
    margin-top: 12px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Create content
  regionDisplay.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 8px;">
      <span style="font-size: 18px; margin-right: 8px;">🌍</span>
      <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.5px;">REGION INFORMATION</span>
    </div>
    <div style="font-size: 13px; line-height: 1.6;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="opacity: 0.9;">Country:</span>
        <span style="font-weight: 600;">${regionData.country || 'Unknown'}</span>
      </div>
      ${regionData.countryCode ? `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="opacity: 0.9;">Code:</span>
        <span style="font-weight: 600;">${regionData.countryCode}</span>
      </div>
      ` : ''}
      ${regionData.language && regionData.language !== 'Unknown' ? `
      <div style="display: flex; justify-content: space-between;">
        <span style="opacity: 0.9;">Language:</span>
        <span style="font-weight: 600;">${regionData.language}</span>
      </div>
      ` : ''}
    </div>
  `;
  
  // Insert after follow button container
  followButtonContainer.parentNode.insertBefore(regionDisplay, followButtonContainer.nextSibling);
  
  console.log('Region display injected successfully');
}

// Function to show loading state
function showLoadingState() {
  const existingDisplay = document.getElementById('tiktok-region-display');
  if (existingDisplay) {
    existingDisplay.remove();
  }
  
  const followButtonContainer = document.querySelector('[data-e2e="follow-button"]')?.parentElement ||
                                document.querySelector('button[data-e2e="follow-button"]')?.parentElement;
  
  if (!followButtonContainer) return;
  
  const loadingDisplay = document.createElement('div');
  loadingDisplay.id = 'tiktok-region-display';
  loadingDisplay.style.cssText = `
    margin-top: 12px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-align: center;
  `;
  
  loadingDisplay.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center;">
      <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 8px;"></div>
      <span style="font-size: 13px;">Fetching region data...</span>
    </div>
  `;
  
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(spinStyle);
  
  followButtonContainer.parentNode.insertBefore(loadingDisplay, followButtonContainer.nextSibling);
}

// Main function to auto-fetch and display region
async function autoFetchAndDisplayRegion() {
  const username = extractTikTokUsername();
  
  if (!username) {
    console.log('No username detected');
    return;
  }
  
  console.log('Auto-fetching region for:', username);
  
  // Show loading state
  showLoadingState();
  
  // Fetch region data
  const regionData = await fetchRegionData(username);
  
  if (regionData) {
    injectRegionDisplay(regionData);
  } else {
    // Show error state
    const existingDisplay = document.getElementById('tiktok-region-display');
    if (existingDisplay) {
      existingDisplay.innerHTML = `
        <div style="text-align: center; font-size: 13px;">
          <span style="opacity: 0.9;">⚠️ Could not fetch region data</span>
        </div>
      `;
    }
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getUserInfo') {
    const userInfo = extractUserInfo();
    sendResponse(userInfo);
  }
  return true;
});

// Auto-detect when on a user profile and send notification
function checkIfUserProfile() {
  const username = extractTikTokUsername();
  if (username) {
    chrome.runtime.sendMessage({
      action: 'userDetected',
      username: username
    });
    
    // Auto-fetch region data after a short delay
    setTimeout(() => {
      autoFetchAndDisplayRegion();
    }, 2000); // Wait 2 seconds for page to fully load
  }
}

// Run check on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkIfUserProfile);
} else {
  checkIfUserProfile();
}

// Monitor URL changes (TikTok is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(checkIfUserProfile, 1000); // Wait for page content to load
  }
}).observe(document, { subtree: true, childList: true });

