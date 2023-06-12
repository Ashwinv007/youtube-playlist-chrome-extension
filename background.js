// chrome.runtime.onInstalled.addListener(() => {
//     chrome.action.setBadgeText({
//       text: 'OFF'
//     });
//   });
    const ytw = '&index';
    const ytp = 'https://www.youtube.com/playlist?list=';


   


    // When the yt load-extension action
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        console.log('Tab updated:', tab.url); }
    
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

      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        playlistId: playlistId
            }).then(console.log('message sent to contentScript.js'));

     
                  
            
      // // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
      // const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
      // // Next state will always be the opposite
      // const nextState = prevState === 'ON' ? 'OFF' : 'ON';
  
      // // Set the action badge to the next state
      // await chrome.action.setBadgeText({
      //   tabId: tab.id,
      //   text: nextState
      // });
  
      // if (nextState === 'ON') {
      //   // Insert the CSS file when the user turns the extension on
      //   const queryParameters = tab.url.split("?")[1];
      //   const urlParameters = new URLSearchParams(queryParameters);

      //   await chrome.scripting.insertCSS({
      //     files: ['focus-mode.css'],
      //     target: { tabId: tab.id }
      //   });
      // } else if (nextState === 'OFF') {
      //   // Remove the CSS file when the user turns the extension off
      //   await chrome.scripting.removeCSS({
      //     files: ['focus-mode.css'],
      //     target: { tabId: tab.id }
      //   });
      // }
    }
  });





    // Listen for messages from the content script
    //  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //   if (message.action === 'injectCSS') {
    //     console.log("demo css")
    //     // Insert CSS into the active tab
    //     // chrome.scripting.insertCSS({
    //     //        files: ['focus-mode.css'],
    //     //        target: tab.id,
    //     //      });
        
    //   }
    // });