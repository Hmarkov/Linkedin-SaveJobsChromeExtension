(() => {
    let PlaceSaveBtn;
    let currentJobID = "";
    let Jobs = [];
  
    const fetchJobs = () => {
      return new Promise((resolve) => {
        chrome.storage.sync.get(["Jobs"], (obj) => {
          resolve(obj["Jobs"] ? JSON.parse(obj["Jobs"]) : []);
        });
      });
    };
  
    const LockJobApplicationAndSave = async () => {
      const apply=document.getElementsByClassName("jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view")[0];
      const easy=document.getElementsByClassName("jobs-apply-button artdeco-button artdeco-button--icon-right artdeco-button--3 artdeco-button--primary ember-view")[0];
      const JobTitle= document.getElementsByClassName("t-24 t-bold jobs-unified-top-card__job-title")[0].textContent;
      var FullUrl=window.location.href;
      const JobId=FullUrl.split('currentJobId=').pop().split('&')[0];
      const newJob = {
        Title: JobTitle,
        ID: JobId,
      };
      Jobs = await fetchJobs();
      Jobs.forEach(function (arrayItem) {
        if(arrayItem.ID){
            if(!apply){
                easy.disabled=true;
            }else{
                apply.disabled=true;
            }
           
        }else{
          chrome.storage.sync.set({"Jobs": JSON.stringify([...Jobs, newJob])});
        }
      });
    };

    const ExistingJobsChck = async () => {
      const apply=document.getElementsByClassName("jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view")[0];
      const easy=document.getElementsByClassName("jobs-apply-button artdeco-button artdeco-button--icon-right artdeco-button--3 artdeco-button--primary ember-view")[0];
      
      Jobs = await fetchJobs();
      Jobs.forEach(function (arrayItem) {
      if(arrayItem.ID){
          if(!apply){
              easy.disabled=true;
          }else{
              apply.disabled=true;
          }
      }});
    };
    const newJobLoaded = async () => {
      const bookmarkBtnExists = document.getElementsByClassName("lock-btn")[0];
      if (!bookmarkBtnExists) {
        const bookmarkBtn = document.createElement("img");
        bookmarkBtn.src = chrome.runtime.getURL("assets/padlock.png");
        bookmarkBtn.className = "jobs-lock " + "lock-btn";
        bookmarkBtn.title = "Click to lock apply button";
        PlaceSaveBtn = document.getElementsByClassName("jobs-search-results-list__subtitle")[0];
        PlaceSaveBtn.appendChild(bookmarkBtn);
        bookmarkBtn.addEventListener("click", LockJobApplicationAndSave);
      }
    };
  
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
      const { type, value, JobID } = obj;
      if (type === "NEW") {
        currentJobID = JobID;
        // console.log(currentJobID);
        newJobLoaded();
        setTimeout(function(){
          ExistingJobsChck();
          
      }, 500);
      AddIDs();
      }
    });
  
    newJobLoaded();
  })();
  
  const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
  
    return date.toISOString().substr(11, 8);
  };