// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Set up backend connection
const BACKEND_URL = 'http://localhost:8000';

// Handle messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  if (request.type === 'classify') {
    console.log('Sending request to backend:', request.urls);
    
    fetch(`${BACKEND_URL}/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: request.urls }),
    })
      .then(response => {
        console.log('Backend response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Backend response data:', data);
        sendResponse({ success: true, data });
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }
});
