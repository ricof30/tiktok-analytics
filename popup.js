// Popup script
let currentUserInfo = null;

// API endpoint - using deployed server
const API_BASE_URL = 'https://tiktok-analytics-ksex.onrender.com';

// Get user info when popup opens
async function loadUserInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url || !tab.url.includes('tiktok.com')) {
      showWarning(true);
      return;
    }
    
    showWarning(false);
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'getUserInfo' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error:', chrome.runtime.lastError);
        showWarning(true);
        return;
      }
      
      if (response && response.username) {
        currentUserInfo = response;
        displayUserInfo(response);
        enableFetchButton();
      } else {
        showWarning(true);
      }
    });
  } catch (error) {
    console.error('Error loading user info:', error);
    showWarning(true);
  }
}

function displayUserInfo(userInfo) {
  document.getElementById('username').textContent = '@' + userInfo.username;
  
  if (userInfo.followers || userInfo.following || userInfo.likes) {
    document.getElementById('statsGrid').style.display = 'grid';
    
    if (userInfo.followers) {
      document.getElementById('followers').textContent = userInfo.followers;
    }
    if (userInfo.following) {
      document.getElementById('following').textContent = userInfo.following;
    }
    if (userInfo.likes) {
      document.getElementById('likes').textContent = userInfo.likes;
    }
  }
}

function showWarning(show) {
  document.getElementById('warningSection').style.display = show ? 'block' : 'none';
}

function enableFetchButton() {
  const btn = document.getElementById('fetchRegionBtn');
  btn.disabled = false;
}

function showStatus(message, type) {
  const statusDiv = document.getElementById('statusDiv');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
}

function hideStatus() {
  document.getElementById('statusDiv').style.display = 'none';
}

function showRegionInfo(regionData) {
  document.getElementById('country').textContent = regionData.country || '-';
  document.getElementById('region').textContent = regionData.region || '-';
  document.getElementById('city').textContent = regionData.city || '-';
  document.getElementById('regionInfo').style.display = 'block';
}

// Fetch region data from omar-thing.site
async function fetchUserRegion() {
  if (!currentUserInfo || !currentUserInfo.username) {
    showStatus('No user selected', 'error');
    return;
  }
  
  const btn = document.getElementById('fetchRegionBtn');
  const btnText = document.getElementById('btnText');
  
  btn.disabled = true;
  btnText.innerHTML = '<span class="loader"></span>Fetching Region...';
  hideStatus();
  
  try {
    // Build API URL using the deployed server
    const apiUrl = `${API_BASE_URL}/api/user-region?username=${encodeURIComponent(currentUserInfo.username)}`;
    
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response content-type:', response.headers.get('content-type'));
    
    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error('Server returned non-JSON response. Make sure the backend server is running on localhost:3000');
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    
    // Extract the actual region data from the response
    const regionData = data.data || data;
    
    showRegionInfo(regionData);
    showStatus('✓ Region data fetched successfully!', 'success');
    
  } catch (error) {
    console.error('Error fetching region:', error);
    
    // Provide helpful error messages
    let errorMessage = error.message;
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      errorMessage = 'Cannot connect to backend server. Make sure it\'s running on localhost:3000 (run: npm start)';
    }
    
    showStatus('❌ ' + errorMessage, 'error');
    
    // Show instructions in console
    console.log('\n=== TROUBLESHOOTING ===');
    console.log('1. Make sure the backend server is running:');
    console.log('   cd /path/to/extension && npm install && npm start');
    console.log('2. Server should be accessible at: http://localhost:3000/health');
    console.log('3. Check server logs for errors');
    console.log('4. Update omar-thing.site selectors in server.js');
    console.log('=======================\n');
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Fetch User Region';
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  
  document.getElementById('fetchRegionBtn').addEventListener('click', fetchUserRegion);
});
