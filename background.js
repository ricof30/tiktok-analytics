// Background service worker
console.log('TikTok Analytics Extension: Background service worker loaded');

// Store detected users
let detectedUsers = [];

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'userDetected') {
    console.log('User detected:', request.username);
    
    // Store in detected users
    if (!detectedUsers.includes(request.username)) {
      detectedUsers.push(request.username);
    }
    
    // Update badge
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#00ff00' });
  }
  
  if (request.action === 'fetchRegion') {
    // This will be handled by the popup since service workers can't use Puppeteer
    sendResponse({ success: true });
  }
  
  return true;
});

// Clear badge when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
});
