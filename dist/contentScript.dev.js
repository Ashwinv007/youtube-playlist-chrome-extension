"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Function to check the last script element for a specific pattern
function checkLastScriptElement() {
  var scriptElements = document.body.getElementsByTagName('script'); // Check if there are script elements in the body

  if (scriptElements.length > 0) {
    // Get the last script element
    var lastScriptElement = scriptElements[scriptElements.length - 1]; // Check the contents of the last script element

    var scriptContent = lastScriptElement.textContent || lastScriptElement.innerText; // Check if the script content contains a specific pattern

    if (scriptContent.includes("window.ytcsi.info('st'")) {
      // Function to add a URL to the "WatchedVideo" array in chrome.storage
      var addToWatchedVideoArray = function addToWatchedVideoArray(url) {
        chrome.storage.local.get({
          WatchedVideo: []
        }, function (result) {
          var watchedVideoArray = result.WatchedVideo;
          watchedVideoArray.push(url); // Update the "WatchedVideo" array in chrome.storage

          chrome.storage.local.set({
            WatchedVideo: watchedVideoArray
          }, function () {
            if (chrome.runtime.lastError) {
              console.error("Error setting WatchedVideo array:", chrome.runtime.lastError);
            } else {
              console.log("Added ".concat(url, " to WatchedVideo array."));
            }
          });
        });
      };

      var checkIfVideoViewed = function checkIfVideoViewed(playlistId) {
        if (document.querySelector("div.ad-showing")) {
          //Ad is active as a video 
          console.log("this is an ad");
          setTimeout(checkIfVideoViewed, 1000); // Check again after 1 second
        } else {
          console.log("the video is playing");
          console.log("executing");
          youtubePlayer = document.getElementsByClassName('video-stream')[0];
          var currentTimeElement = youtubePlayer.currentTime;
          var durationElement = youtubePlayer.duration;

          if (!currentTimeElement || !durationElement) {
            console.log('Video player not fully loaded, waiting...');
            setTimeout(checkIfVideoViewed, 1000); // Check again after 1 second

            return;
          }

          console.log(currentTimeElement, durationElement);
          var currentTime = currentTimeElement; // Current time in seconds

          var duration = durationElement; // Duration in seconds

          console.log("".concat(currentTime, " and ").concat(duration));
          console.log(_typeof(currentTime)); // Calculate the percentage of video viewed

          var percentageViewed = currentTime / duration * 100;
          console.log("".concat(percentageViewed));

          if (percentageViewed >= 70) {
            console.log('This video is viewed.');
            addToWatchedVideoArray(window.location.href);
            loadDataWithPlaylistId(playlistId);
          } else {
            console.log('Not yet viewed.');
            setTimeout(checkIfVideoViewed, 1000); // Check again after 1 second
          }
        }
      };

      var checkIfVideoViewedWithDelay = function checkIfVideoViewedWithDelay() {
        // Wait for 5 seconds
        setTimeout(function () {
          // Retrieve the "currentclicked" value from chrome.storage
          chrome.storage.local.get(['currentclicked'], function (result) {
            if (chrome.runtime.lastError) {
              console.error("Error retrieving currentclicked:", chrome.runtime.lastError);
            } else {
              var currentUrl = window.location.href;
              var currentclicked = result.currentclicked;

              if (currentUrl === currentclicked) {
                console.log("Matched: ".concat(currentUrl, " and ").concat(currentclicked)); // URL matches, call the checkIfVideoViewed function

                checkIfVideoViewed(playlistId); //delete current clicked

                chrome.storage.local.remove('currentclicked', function () {
                  if (chrome.runtime.lastError) {
                    console.error("Error removing currentclicked:", chrome.runtime.lastError);
                  } else {
                    console.log("currentclicked removed.");
                  }
                });
              } else {
                console.log("URL does not match currentclicked."); // Delete the "currentclicked" value

                chrome.storage.local.remove('currentclicked', function () {
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
      }; // Create the video modal container


      var retrieveCurrentPlaylist = function retrieveCurrentPlaylist() {
        var storageData;
        return regeneratorRuntime.async(function retrieveCurrentPlaylist$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return regeneratorRuntime.awrap(chrome.storage.local.get('currentplist'));

              case 3:
                storageData = _context.sent;

                if (storageData.currentplist) {
                  playlistId = storageData.currentplist;
                  console.log(playlistId); // Call the function to load data using the retrieved playlistId

                  loadDataWithPlaylistId(playlistId);
                }

                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.error("Error retrieving currentplist from storage:", _context.t0);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, null, null, [[0, 7]]);
      }; // Fetch YouTube data


      var loadDataWithPlaylistId = function loadDataWithPlaylistId(playlistId) {
        var nextPageToken,
            apiKey,
            apiUrl,
            checkUrlChange,
            response,
            data,
            nextpagetoken,
            items,
            videoData,
            videoListContainer,
            previousUrl,
            _args2 = arguments;
        return regeneratorRuntime.async(function loadDataWithPlaylistId$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                nextPageToken = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
                apiKey = "AIzaSyBErC4A6mMq81OB7cHbUnlCYwtqBMcGml4";
                apiUrl = "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=".concat(playlistId, "&key=").concat(apiKey); // If there's a nextPageToken, append it to the API URL

                if (nextPageToken) {
                  apiUrl += "&pageToken=".concat(nextPageToken);
                }

                _context2.prev = 4;

                // Function to check if the URL has changed and hide the modal
                checkUrlChange = function checkUrlChange() {
                  var currentUrl = window.location.href;

                  if (currentUrl !== previousUrl) {
                    hideModal();
                    previousUrl = currentUrl;
                  }
                };

                _context2.next = 8;
                return regeneratorRuntime.awrap(fetch(apiUrl));

              case 8:
                response = _context2.sent;
                _context2.next = 11;
                return regeneratorRuntime.awrap(response.json());

              case 11:
                data = _context2.sent;
                nextpagetoken = data.nextPageToken;
                items = data.items;
                videoData = items.map(function (item) {
                  var videoTitle = item.snippet.title;
                  var thumbnailObj = item.snippet.thumbnails.medium;
                  var thumbnailUrl = thumbnailObj ? thumbnailObj.url : 'URL_NOT_AVAILABLE'; // Check if thumbnailObj exists

                  var videoUrl = "https://www.youtube.com/watch?v=".concat(item.snippet.resourceId.videoId);
                  return {
                    videoTitle: videoTitle,
                    thumbnailUrl: thumbnailUrl,
                    videoUrl: videoUrl
                  };
                }); // Log the number of items in the fetched data

                console.log(data.items.length); // Create the video list container

                videoListContainer = document.createElement("div");
                videoListContainer.id = "videoList"; // Populate video list

                videoData.forEach(function (item) {
                  var videoDiv = document.createElement("div");
                  videoDiv.classList.add("video-item");
                  videoDiv.style.cursor = "pointer"; // Set cursor to pointer

                  var thumbnailImg = document.createElement("img");
                  thumbnailImg.src = item.thumbnailUrl;
                  thumbnailImg.alt = item.videoTitle;
                  thumbnailImg.classList.add("thumbnail");
                  var titleSpan = document.createElement("span");
                  titleSpan.textContent = item.videoTitle;
                  titleSpan.classList.add("title"); // Check if the item.url is in the WatchedVideo array

                  chrome.storage.local.get({
                    WatchedVideo: []
                  }, function (result) {
                    var watchedVideoArray = result.WatchedVideo;

                    if (watchedVideoArray.includes(item.videoUrl)) {
                      // Video has been watched, change background color to blue
                      videoDiv.style.backgroundColor = 'rgb(79 187 206)';
                    }
                  });
                  videoDiv.appendChild(thumbnailImg);
                  videoDiv.appendChild(titleSpan); // Add a click event listener to the video div

                  videoDiv.addEventListener("click", function () {
                    chrome.storage.local.set({
                      currentclicked: item.videoUrl
                    }, function () {
                      if (chrome.runtime.lastError) {
                        console.error("Error setting currentclicked:", chrome.runtime.lastError);
                      } else {
                        console.log("currentclicked set to:", item.videoUrl);
                        window.location.href = item.videoUrl;
                      }
                    });
                  });
                  videoListContainer.appendChild(videoDiv);
                }); // Append the video list container to the modal content

                modalContent.appendChild(videoListContainer);
                document.addEventListener('click', function (event) {
                  var containingElement = document.getElementById('modalcid');
                  var ggsi = document.getElementsByClassName('ytp-button Goldstar-icon')[0];

                  if (!containingElement.contains(event.target) && event.target !== ggsi) {
                    hideModal();
                  } else {
                    // Check for URL changes when clicking inside the modal
                    checkUrlChange();
                  }
                });
                previousUrl = window.location.href;
                setInterval(checkUrlChange, 500); // Check every 500 milliseconds (adjust as needed)

                if (!nextpagetoken) {
                  _context2.next = 26;
                  break;
                }

                _context2.next = 26;
                return regeneratorRuntime.awrap(loadDataWithPlaylistId(playlistId, nextpagetoken));

              case 26:
                _context2.next = 31;
                break;

              case 28:
                _context2.prev = 28;
                _context2.t0 = _context2["catch"](4);
                console.error("Error fetching data:", _context2.t0);

              case 31:
              case "end":
                return _context2.stop();
            }
          }
        }, null, null, [[4, 28]]);
      };

      // Function to show the modal
      var showModal = function showModal() {
        modal.style.display = "block";
      }; // Function to hide the modal


      var hideModal = function hideModal() {
        modal.style.display = "none";
      };

      var clearStorage = function clearStorage() {
        return new Promise(function (resolve, reject) {
          chrome.storage.local.clear(function () {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve();
            }
          });
        });
      };

      var delimplaylist = function delimplaylist() {
        var goldstardel, tabUrl, ytw2, ytp2;
        return regeneratorRuntime.async(function delimplaylist$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return regeneratorRuntime.awrap(clearStorage());

              case 3:
                console.log("Storage cleared successfully");
                goldstardel = document.getElementsByClassName('ytp-button Goldstar-icon')[0]; // Check if the element exists before attempting to remove iti

                if (goldstardel) {
                  // Remove the element
                  goldstardel.remove();
                } else {
                  console.log('Gold not found.');
                }

                tabUrl = location.href;
                ytw2 = '&index';
                ytp2 = 'https://www.youtube.com/playlist?list=';

                if (tabUrl.startsWith(ytp2) || tabUrl.includes(ytw2)) {
                  newPlaylistLoaded();
                  console.log("URL of the active tab:", tabUrl);
                }

                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](0);
                console.error("Error clearing storage:", _context3.t0);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, null, null, [[0, 12]]);
      };

      var modal = document.createElement("div");
      modal.id = "videoModal";
      modal.classList.add("modal");
      document.body.appendChild(modal); // Create the modal content container

      var modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      modalContent.id = "modalcid";
      modal.appendChild(modalContent);
      var modalContentheader = document.createElement("div");
      modalContentheader.classList.add("headerinmodalcontent");
      modalContent.appendChild(modalContentheader);
      var headingforthelist = document.createElement("h1");
      headingforthelist.classList.add("modal-heading");
      headingforthelist.textContent = "Important Playlist";
      modalContentheader.appendChild(headingforthelist);
      var delbuttonplaylist = document.createElement("button");
      delbuttonplaylist.classList.add("delbuttonforplaylist");
      delbuttonplaylist.textContent = "Delete";
      modalContentheader.appendChild(delbuttonplaylist);
      delbuttonplaylist.addEventListener("click", function () {
        delimplaylist();
        window.location.reload();
        console.log('Playlist deleted. Page reloading...');
      });
      var playlistId = "";
      retrieveCurrentPlaylist();
      checkIfVideoViewedWithDelay(playlistId);
      console.log('loaded');

      var addimplaylist = function addimplaylist() {
        var stardel;
        return regeneratorRuntime.async(function addimplaylist$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                console.log('add Function triggered'); // Store the playlistId in the storage

                _context4.next = 3;
                return regeneratorRuntime.awrap(chrome.storage.local.set({
                  currentplist: currentplist
                }));

              case 3:
                // Confirmation message
                console.log("PlaylistId ".concat(currentplist, " stored in the storage.")); // turn the icon into golden

                _context4.next = 6;
                return regeneratorRuntime.awrap(chrome.storage.local.set({
                  GSI: true
                }));

              case 6:
                try {
                  stardel = document.getElementsByClassName('ytp-button star-icon')[0]; // Check if the element exists before attempting to remove it

                  if (stardel) {
                    // Remove the element
                    stardel.remove();
                  } else {
                    console.log('Star not found.');
                  }
                } catch (error) {
                  console.error("Star clearing issue:", error);
                }

                GSIvisible();

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        });
      };

      GSIvisible = function GSIvisible() {
        var goldstarExists, storageData, isGSIEnabled, GoldstarIcon;
        return regeneratorRuntime.async(function GSIvisible$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                goldstarExists = document.getElementsByClassName('ytp-button Goldstar-icon')[0];

                if (goldstarExists) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 4;
                return regeneratorRuntime.awrap(chrome.storage.local.get('GSI'));

              case 4:
                storageData = _context5.sent;
                isGSIEnabled = storageData.GSI;

                if (isGSIEnabled) {
                  GoldstarIcon = document.createElement("img");
                  GoldstarIcon.src = chrome.runtime.getURL('images/star-icon-golden.png');
                  GoldstarIcon.className = "ytp-button" + " Goldstar-icon";
                  GoldstarIcon.title = "Click to View the important playlist";
                  topIconsContainer = document.getElementById("buttons");
                  topIconsContainer.appendChild(GoldstarIcon);
                  GoldstarIcon.style.height = "32px";
                  GoldstarIcon.style.width = "32px";
                  GoldstarIcon.style.borderRadius = "100%";
                  GoldstarIcon.addEventListener("click", showModal);
                  console.log('playlist del function executing');
                }

                console.log('GSI enabled all over youtube');

              case 8:
              case "end":
                return _context5.stop();
            }
          }
        });
      };

      var newPlaylistLoaded = function newPlaylistLoaded() {
        var starIconExists, plgoldstarExists, likedcontent, watchlatercontent, currentavoidurl, starIcon;
        return regeneratorRuntime.async(function newPlaylistLoaded$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                starIconExists = document.getElementsByClassName('ytp-button star-icon')[0];
                plgoldstarExists = document.getElementsByClassName('ytp-button Goldstar-icon')[0];
                likedcontent = "https://www.youtube.com/playlist?list=LL";
                watchlatercontent = "https://www.youtube.com/playlist?list=WL";
                currentavoidurl = window.location.href;

                if (!starIconExists && !plgoldstarExists && !(currentavoidurl === likedcontent || currentavoidurl === watchlatercontent)) {
                  starIcon = document.createElement("img");
                  starIcon.src = chrome.runtime.getURL('images/starbuttonbasic.png');
                  starIcon.className = "ytp-button" + " star-icon";
                  starIcon.title = "Click to mark this playlist as important";
                  topIconsContainer = document.getElementById("buttons");
                  topIconsContainer.appendChild(starIcon);
                  starIcon.style.height = "32px";
                  starIcon.style.width = "32px";
                  starIcon.style.borderRadius = "100%";
                  starIcon.addEventListener("click", function () {
                    addimplaylist();
                    window.location.reload(); // Optionally, you can add a message to the console or a confirmation message to the user

                    console.log('function added successfully');
                  });
                }

              case 6:
              case "end":
                return _context6.stop();
            }
          }
        });
      };

      chrome.runtime.onMessage.addListener(function (obj, sender, sendResponse) {
        var type = obj.type,
            value = obj.value,
            playlistId = obj.playlistId;

        if (type === 'NEW') {
          currentplist = playlistId;
          newPlaylistLoaded().then(function () {
            console.log('Message received and function executed');
            sendResponse({
              message: 'Function executed successfully'
            });
          });
        }

        if (type === 'GSI_Check') {
          GSIvisible().then(function () {
            console.log('GSI info received and function executed');
            sendResponse({
              message: 'Function executed successfully'
            });
          });
        }

        return true;
      }); // Configure and start the observer
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
  } // If not found and still within the allowed attempts, wait for 1 second and check again


  if (attempts < maxAttempts) {
    attempts++;
    setTimeout(checkLastScriptElement, 1500);
  } else {
    console.log("Pattern not found after 20 attempts.");
  }
}

var attempts = 0;
var maxAttempts = 20; // Start the initial check

checkLastScriptElement();