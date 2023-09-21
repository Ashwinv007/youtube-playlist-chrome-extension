// Function to check the last script element for a specific pattern
function checkLastScriptElement() {
  const scriptElements = document.body.getElementsByTagName('script');
  
  // Check if there are script elements in the body
  if (scriptElements.length > 0) {
    // Get the last script element
    const lastScriptElement = scriptElements[scriptElements.length - 1];
    
    // Check the contents of the last script element
    const scriptContent = lastScriptElement.textContent || lastScriptElement.innerText;
    
    // Check if the script content contains a specific pattern
    if (scriptContent.includes("window.ytcsi.info('st'")) {



      
// Function to add a URL to the "WatchedVideo" array in chrome.storage
function addToWatchedVideoArray(url) {
  chrome.storage.local.get({ WatchedVideo: [] }, function (result) {
    const watchedVideoArray = result.WatchedVideo;
    watchedVideoArray.push(url);

    // Update the "WatchedVideo" array in chrome.storage
    chrome.storage.local.set({ WatchedVideo: watchedVideoArray }, function () {
      if (chrome.runtime.lastError) {
        console.error("Error setting WatchedVideo array:", chrome.runtime.lastError);
      } else {
        console.log(`Added ${url} to WatchedVideo array.`);
      }
    });
  });
}



function checkIfVideoViewed(playlistId) {
  if (document.querySelector("div.ad-showing")) {
           //Ad is active as a video 
           console.log("this is an ad")
           setTimeout(checkIfVideoViewed, 1000); // Check again after 1 second

           
        }
        else {
console.log("the video is playing");
console.log("executing")
youtubePlayer = document.getElementsByClassName('video-stream')[0];
const currentTimeElement = youtubePlayer.currentTime;
const durationElement = youtubePlayer.duration;

if (!currentTimeElement || !durationElement) {
  console.log('Video player not fully loaded, waiting...');
  setTimeout(checkIfVideoViewed, 1000); // Check again after 1 second
  return;
}
console.log(currentTimeElement, durationElement)


const currentTime = currentTimeElement; // Current time in seconds
const duration = durationElement; // Duration in seconds

console.log(`${currentTime} and ${duration}`)
console.log(typeof(currentTime))

// Calculate the percentage of video viewed
const percentageViewed = (currentTime / duration) * 100;
console.log(`${percentageViewed}`)

if (percentageViewed >= 70) {
  console.log('This video is viewed.');
  addToWatchedVideoArray(window.location.href)
  loadDataWithPlaylistId(playlistId)
} else {
  console.log('Not yet viewed.');
  setTimeout(checkIfVideoViewed, 1000); // Check again after 1 second

  
}
}


}

function checkIfVideoViewedWithDelay() {
  // Wait for 5 seconds
  setTimeout(() => {
    // Retrieve the "currentclicked" value from chrome.storage
    chrome.storage.local.get(['currentclicked'], function(result) {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving currentclicked:", chrome.runtime.lastError);
      } else {
        const currentUrl = window.location.href;
        const currentclicked = result.currentclicked;

        if (currentUrl === currentclicked) {
          console.log(`Matched: ${currentUrl} and ${currentclicked}`);
          // URL matches, call the checkIfVideoViewed function
          checkIfVideoViewed(playlistId);
          //delete current clicked
          chrome.storage.local.remove('currentclicked', function() {
            if (chrome.runtime.lastError) {
              console.error("Error removing currentclicked:", chrome.runtime.lastError);
            } else {
              console.log("currentclicked removed.");
            }
          });
        } else {
          console.log("URL does not match currentclicked.");
          // Delete the "currentclicked" value
          chrome.storage.local.remove('currentclicked', function() {
            if (chrome.runtime.lastError) {
              console.error("Error removing currentclicked:", chrome.runtime.lastError);
            } else {
              console.log("currentclicked removed.");
            }
          });
        }
      }
    });
  }, 5000); // Wait for 5 seconds (5000 milliseconds)
}



// Create the video modal container
const modal = document.createElement("div");
modal.id = "videoModal";
modal.classList.add("modal");
document.body.appendChild(modal);


// Create the modal content container
const modalContent = document.createElement("div");
modalContent.classList.add("modal-content");
modalContent.id = "modalcid"
modal.appendChild(modalContent);

const modalContentheader = document.createElement("div");
modalContentheader.classList.add("headerinmodalcontent")
modalContent.appendChild(modalContentheader)

const headingforthelist = document.createElement("h1");
headingforthelist.classList.add("modal-heading")
headingforthelist.textContent = "Important Playlist"; 
modalContentheader.appendChild(headingforthelist)
const delbuttonplaylist = document.createElement("button");
delbuttonplaylist.classList.add("delbuttonforplaylist");
delbuttonplaylist.textContent = "Delete"
modalContentheader.appendChild(delbuttonplaylist);
delbuttonplaylist.addEventListener("click", function () {
  delimplaylist()

  window.location.reload();

  console.log('Playlist deleted. Page reloading...');
});





let playlistId = "";

async function retrieveCurrentPlaylist() {
  try {
    const storageData = await chrome.storage.local.get('currentplist');
    if (storageData.currentplist) {
      playlistId = storageData.currentplist;
      console.log(playlistId)
      // Call the function to load data using the retrieved playlistId
      loadDataWithPlaylistId(playlistId);
    }
  } catch (error) {
    console.error("Error retrieving currentplist from storage:", error);
  }
}





// Fetch YouTube data
async function loadDataWithPlaylistId(playlistId, nextPageToken = null) {
  const apiKey = "AIzaSyBErC4A6mMq81OB7cHbUnlCYwtqBMcGml4"; 

  let apiUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;

  // If there's a nextPageToken, append it to the API URL
  if (nextPageToken) {
    apiUrl += `&pageToken=${nextPageToken}`;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const nextpagetoken = data.nextPageToken;
    const items = data.items;

    const videoData = items.map(item => {
      const videoTitle = item.snippet.title;
      const thumbnailObj = item.snippet.thumbnails.medium;
      const thumbnailUrl = thumbnailObj ? thumbnailObj.url : 'URL_NOT_AVAILABLE'; // Check if thumbnailObj exists
      const videoUrl = `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`;
      return { videoTitle, thumbnailUrl, videoUrl };
    });
    
    
    // Log the number of items in the fetched data
    console.log(data.items.length);
    
    // Create the video list container
    const videoListContainer = document.createElement("div");
    videoListContainer.id = "videoList";

    // Populate video list
    videoData.forEach(item => {
      
      const videoDiv = document.createElement("div");
      videoDiv.classList.add("video-item");
      videoDiv.style.cursor = "pointer"; // Set cursor to pointer

      const thumbnailImg = document.createElement("img");
      thumbnailImg.src = item.thumbnailUrl;
      thumbnailImg.alt = item.videoTitle;
      thumbnailImg.classList.add("thumbnail");

      const titleSpan = document.createElement("span");
      titleSpan.textContent = item.videoTitle;
      titleSpan.classList.add("title");

        // Check if the item.url is in the WatchedVideo array
  chrome.storage.local.get({ WatchedVideo: [] }, function (result) {
    const watchedVideoArray = result.WatchedVideo;
    if (watchedVideoArray.includes(item.videoUrl)) {
      // Video has been watched, change background color to blue
      videoDiv.style.backgroundColor = 'rgb(79 187 206)';
      
    }
  });

      videoDiv.appendChild(thumbnailImg);
      videoDiv.appendChild(titleSpan);

      // Add a click event listener to the video div
  videoDiv.addEventListener("click", () => {
    chrome.storage.local.set({ currentclicked: item.videoUrl }, function() {
      if (chrome.runtime.lastError) {
        console.error("Error setting currentclicked:", chrome.runtime.lastError);
      } else {
        console.log("currentclicked set to:", item.videoUrl);
        window.location.href = item.videoUrl;

      }
    });
  });


      videoListContainer.appendChild(videoDiv);
    });

    // Append the video list container to the modal content
    modalContent.appendChild(videoListContainer);



    document.addEventListener('click', function (event) {
      let containingElement = document.getElementById('modalcid');
      let ggsi = document.getElementsByClassName('ytp-button Goldstar-icon')[0];
    
      if (!containingElement.contains(event.target) && event.target !== ggsi) {
        hideModal();
      } else {
        // Check for URL changes when clicking inside the modal
        checkUrlChange();
      }
    });
    
    // Function to check if the URL has changed and hide the modal
    function checkUrlChange() {
      const currentUrl = window.location.href;
      if (currentUrl !== previousUrl) {
        hideModal();
        previousUrl = currentUrl;
      }
    }
    
    let previousUrl = window.location.href;
    setInterval(checkUrlChange, 500); // Check every 500 milliseconds (adjust as needed)
    

    if (nextpagetoken) {
      await loadDataWithPlaylistId(playlistId, nextpagetoken);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
retrieveCurrentPlaylist();
checkIfVideoViewedWithDelay(playlistId)


// Function to show the modal
function showModal() {
  modal.style.display = "block";

  
}

// Function to hide the modal
function hideModal() {
  modal.style.display = "none";
}


console.log('loaded')

function clearStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.clear(() => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();

      }
    });
  });
}

async function delimplaylist() {
  try {
    await clearStorage();
    console.log("Storage cleared successfully");
    const goldstardel =  document.getElementsByClassName('ytp-button Goldstar-icon') [0];

  // Check if the element exists before attempting to remove iti
  if (goldstardel) {
    // Remove the element
    goldstardel.remove();
  } else {
    console.log('Gold not found.');
  }
      const tabUrl = location.href;
      
      const ytw2 = '&index';
      const ytp2 = 'https://www.youtube.com/playlist?list=';
      
      if (tabUrl.startsWith(ytp2) || tabUrl.includes(ytw2)) {
        newPlaylistLoaded()
        console.log("URL of the active tab:", tabUrl);
      } 
   
  
    
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
}


const addimplaylist = async () => {
  console.log('add Function triggered')
  

  // Store the playlistId in the storage
  await chrome.storage.local.set({ currentplist });

  // Confirmation message
  console.log(`PlaylistId ${currentplist} stored in the storage.`);
  // turn the icon into golden
  await chrome.storage.local.set({ GSI : true });
  try {
    
    const stardel =  document.getElementsByClassName('ytp-button star-icon') [0];

  // Check if the element exists before attempting to remove it
  if (stardel) {
    // Remove the element
    stardel.remove();
  } else {
    console.log('Star not found.');
  }
  
    
  } catch (error) {
    console.error("Star clearing issue:", error);
  }
  GSIvisible()
};

GSIvisible = async() =>{
  const goldstarExists =  document.getElementsByClassName('ytp-button Goldstar-icon') [0]

  if(!goldstarExists){

    const storageData = await chrome.storage.local.get('GSI');
    const isGSIEnabled = storageData.GSI;
    if(isGSIEnabled){
      const GoldstarIcon = document.createElement("img");
  
      GoldstarIcon.src = chrome.runtime.getURL('images/star-icon-golden.png')
      GoldstarIcon.className = "ytp-button" + " Goldstar-icon";
      GoldstarIcon.title = "Click to View the important playlist"
  
      topIconsContainer = document.getElementById("buttons")
  
      topIconsContainer.appendChild(GoldstarIcon)
  
      GoldstarIcon.style.height= "32px";
      GoldstarIcon.style.width= "32px"
      GoldstarIcon.style.borderRadius= "100%";
      


      GoldstarIcon.addEventListener("click", showModal)
      
      console.log('playlist del function executing')
  
  
   
  
  }(console.log('GSI enabled all over youtube'))

  }
 

}

















const newPlaylistLoaded = async() => {
  const starIconExists = document.getElementsByClassName('ytp-button star-icon') [0];
  const plgoldstarExists =  document.getElementsByClassName('ytp-button Goldstar-icon') [0]
  const likedcontent = "https://www.youtube.com/playlist?list=LL"
  const watchlatercontent = "https://www.youtube.com/playlist?list=WL"
  const currentavoidurl = window.location.href;


  if(!starIconExists && !plgoldstarExists && !(currentavoidurl===likedcontent || currentavoidurl===watchlatercontent)) {
    const starIcon = document.createElement("img");

    starIcon.src = chrome.runtime.getURL('images/starbuttonbasic.png')
    starIcon.className = "ytp-button" + " star-icon";
    starIcon.title = "Click to mark this playlist as important"

    topIconsContainer = document.getElementById("buttons")

    topIconsContainer.appendChild(starIcon)

    starIcon.style.height= "32px";
    starIcon.style.width= "32px"
    starIcon.style.borderRadius= "100%";
    
    
    

    starIcon.addEventListener("click", function () {
      addimplaylist()
     
      window.location.reload();
    
      // Optionally, you can add a message to the console or a confirmation message to the user
      console.log('function added successfully')
    });
    

  }
}
chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
  const { type, value, playlistId } = obj;

  if (type === 'NEW') {
    currentplist = playlistId;
    newPlaylistLoaded().then(() => {
      console.log('Message received and function executed');
      sendResponse({ message: 'Function executed successfully' });
    });
  }

  if (type === 'GSI_Check') {
    GSIvisible().then(() => {
      console.log('GSI info received and function executed');
      sendResponse({ message: 'Function executed successfully' });
    });
  }

  return true;
});



// Configure and start the observer
// const config = {
//   childList: true, // Watch for child node changes
//   attributes: true, // Watch for attribute changes
//   subtree: true, // Watch all descendants of the target (including the whole body)
// };

// observer.observe(targetElement, config);

// To disconnect the observer when no longer needed
// observer.disconnect();








      // The last script element contains the specific pattern
      console.log("Last script element contains the pattern.");
      return; // Exit the function
    }
  }
  
  // If not found and still within the allowed attempts, wait for 1 second and check again
  if (attempts < maxAttempts) {
    attempts++;
    setTimeout(checkLastScriptElement, 1500);
  } else {
    console.log("Pattern not found after 20 attempts.");
  }
}

let attempts = 0;
const maxAttempts = 20;

// Start the initial check
checkLastScriptElement();


