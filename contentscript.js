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
      chrome.storage.sync.set({"Jobs": JSON.stringify([...Jobs, newJob])});
      if(Jobs.length==0){
        if(!apply){
          easy.disabled=true;
          chrome.storage.sync.set({"Jobs": JSON.stringify([...Jobs, newJob])});

        }else{
            apply.disabled=true;
            chrome.storage.sync.set({"Jobs": JSON.stringify([...Jobs, newJob])});
        }  
    }else{      
      Jobs.forEach(function (arrayItem) {
      if(arrayItem.ID!=JobId){
          if(!apply){
              easy.disabled=true;
              chrome.storage.sync.set({"Jobs": JSON.stringify([...Jobs, newJob])});

          }else{
              apply.disabled=true;
              chrome.storage.sync.set({"Jobs": JSON.stringify([...Jobs, newJob])});
          }  
      }
    });}
    };

    const DeleteJob = async (id) => {
      Jobs = await fetchJobs();
      Jobs = Jobs.filter(elem => elem.ID != id);
      chrome.storage.sync.set({ ["Jobs"]: JSON.stringify(Jobs) });
    };

    const ExistingJobsChck = async () => {
      const apply=document.getElementsByClassName("jobs-apply-button artdeco-button artdeco-button--3 artdeco-button--primary ember-view")[0];
      const easy=document.getElementsByClassName("jobs-apply-button artdeco-button artdeco-button--icon-right artdeco-button--3 artdeco-button--primary ember-view")[0];
      
      var FullUrl=window.location.href;
      const JobId=FullUrl.split('currentJobId=').pop().split('&')[0];

      Jobs = await fetchJobs();
      Jobs.forEach(function (arrayItem) {
      if(arrayItem.ID==JobId){
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
        bookmarkBtn.src = chrome.runtime.getURL("assets/Save.png");
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
        newJobLoaded();
        setTimeout(function(){
          ExistingJobsChck();
      }, 1000);
      }else if ( type === "TAB") {
        window.open("/jobs/search/?currentJobId="+value, '_blank').focus();
        setTimeout(function(){
              }, 10000);
              ExistingJobsChck();
      }else if ( type === "DELETE") {
        DeleteJob(value);
      }
    });
  
    newJobLoaded();
  })();
  
  const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substr(11, 8);
  };