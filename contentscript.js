(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentJobID = "";
    let currentVideoBookmarks = [];
  
    // const fetchBookmarks = () => {
    //   return new Promise((resolve) => {
    //     chrome.storage.sync.get([currentVideo], (obj) => {
    //       resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
    //     });
    //   });
    // };
  
    const LockJobApplicationAndSave = async () => {
        
        const apply=document.getElementsByClassName("jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view")[0];
        const easy=document.getElementsByClassName("jobs-apply-button artdeco-button artdeco-button--icon-right artdeco-button--3 artdeco-button--primary ember-view")[0];
        if(!apply){
            easy.disabled=true;
        }else{
            apply.disabled=true;
        }
        const JobTitle= document.getElementsByClassName("t-24 t-bold jobs-unified-top-card__job-title")[0].textContent;
        var FullUrl=window.location.href;
        var JobId=fullurl.split('currentJobId=').pop().split('&')[0];
      const newJobID = {
        Title: JobTitle,
        ID: JobId,
      };
  
    //   currentVideoBookmarks = await fetchBookmarks();
  
    //   chrome.storage.sync.set({
    //     [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
    //   });
    };
  
    const newJobLoaded = async () => {
      const bookmarkBtnExists = document.getElementsByClassName("lock-btn")[0];
  
    //   currentVideoBookmarks = await fetchBookmarks();
  
      if (!bookmarkBtnExists) {
        const bookmarkBtn = document.createElement("img");
        bookmarkBtn.src = chrome.runtime.getURL("assets/padlock.png");
        bookmarkBtn.className = "jobs-lock " + "lock-btn";
        bookmarkBtn.title = "Click to lock apply button";
  
        youtubeLeftControls = document.getElementsByClassName("jobs-search-results-list__subtitle")[0];

        youtubeLeftControls.appendChild(bookmarkBtn);
        bookmarkBtn.addEventListener("click", LockJobApplicationAndSave);
      }
    };
  
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, value, JobID } = obj;
  
      if (type === "NEW") {
        currentJobID = JobID;
        console.log(currentJobID);
        newJobLoaded();
      } else if (type === "PLAY") {
        youtubePlayer.currentTime = value;
      } else if ( type === "DELETE") {
        currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
        chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
  
        response(currentVideoBookmarks);
      }
    });
  
    newJobLoaded();
  })();
  
  const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
  
    return date.toISOString().substr(11, 8);
  };