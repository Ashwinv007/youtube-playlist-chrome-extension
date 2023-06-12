const addimplaylist = async () => {
  console.log('Function triggered')
  

  // Store the playlistId in the storage
  await chrome.storage.local.set({ currentplist });

  // Confirmation message
  console.log(`PlaylistId ${currentplist} stored in the storage.`);
};














const newPlaylistLoaded = async() => {
  const starIconExists = document.getElementsByClassName('yellow-str') [0];


  if(!starIconExists) {
    const starIcon = document.createElement("img");

    starIcon.src = chrome.runtime.getURL('images/starbuttonbasic.png')
    starIcon.className = "ytp-button" + "star-icon";
    starIcon.title = "Click to mark this playlist as important"

    topIconsContainer = document.getElementById("buttons")

    topIconsContainer.appendChild(starIcon)

    starIcon.style.height= "32px";
    starIcon.style.width= "32px"
    starIcon.style.borderRadius= "100%";
    
    

    starIcon.addEventListener("click", addimplaylist);
    console.log('function added successfully')

    // Send a message to the background script to request CSS injection
    // chrome.runtime.sendMessage({ action: 'injectCSS' }).then((console.log('injection sent')))


  }
}


chrome.runtime.onMessage.addListener((obj, sender, response) =>{
  const {type, playlistId} = obj;

  if (type === 'NEW') {
    currentplist = playlistId
    newPlaylistLoaded().then(console.log('Message received and function executed '));
  }
})



