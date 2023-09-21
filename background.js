// Variable to store timeout ID
let iconTimeout;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    clearTimeout(iconTimeout); // Clear any existing timeouts

    // Set a timeout to display the icon after a brief delay
    iconTimeout = setTimeout(() => {
      run(tab); 
    },1500); 
  }
});



chrome.tabs.onActivated.addListener(info => {
  chrome.tabs.get(info.tabId, run);
});

let iconTimeout2;


// Add an event listener for onHistoryStateUpdated
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  // Check if the URL or other relevant information has changed
  if (details.url && details.url.includes("https://*.youtube.com/*")) {
    clearTimeout(iconTimeout2); // Clear any existing timeouts



    iconTimeout2 = setTimeout(() => {
      run(details.url);
    },1500);
    console.log("URL changed to: " + details.url);
  }
});


const processingTabId = {};
function run(tab) {
  // Send GSI check message with callback
  chrome.tabs.sendMessage(tab.id, {
    type: "GSI_Check",
  }, () => {
    console.log('GSI alert sent to contentScript.js');

    // GSI check is complete, proceed with other statements
    setTimeout(() => {
      if (processingTabId[tab.id]) return;
      processingTabId[tab.id] = true;

      const ytw = '&index';
      const ytp = 'https://www.youtube.com/playlist?list=';

      if (tab.url && (tab.url.startsWith(ytp) || tab.url.includes(ytw))) {
        function getPlaylistId(url) {
          const regex = /[&?]list=([^&]+)/;
          const match = url.match(regex);
          if (match && match[1]) {
            return match[1];
          } else {
            return null;
          }
        }
        const playlistId = getPlaylistId(tab.url);
        console.log("Here is the playlist ID: " + playlistId);

        chrome.tabs.sendMessage(tab.id, {
          type: "NEW",
          playlistId: playlistId
        }, () => {
          console.log('Message sent to contentScript.js');
        });
      }

     
      // When all done:
      delete processingTabId[tab.id];
    }, 3000); 
  });
}
