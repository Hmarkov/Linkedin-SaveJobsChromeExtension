import { getActiveTabURL } from "./utils.js";

const addNewJob = (jobs, job) => {
  const JobsIDElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newJobElement = document.createElement("div");

  JobsIDElement.textContent = job.Title;
  JobsIDElement.className = "job-id";
  controlsElement.className = "job-controls";

  
  setJobAttributes("New Tab", onTAB, controlsElement);
  setJobAttributes("Delete", onDelete, controlsElement);


  newJobElement.className = "rainbow";
  newJobElement.setAttribute("id", job.ID);

  newJobElement.appendChild(JobsIDElement);
  newJobElement.appendChild(controlsElement);
  jobs.appendChild(newJobElement);
};

const viewJobs = (currentJobs=[]) => {
    const JobsElements = document.getElementById("jobs");
    JobsElements.innerHTML = "";

    if (currentJobs.length > 0) {
        for (let i = 0; i < currentJobs.length; i++) {
            const job = currentJobs[i];
            // console.log(job);
            addNewJob(JobsElements, job);
        }
    } else {
    JobsElements.innerHTML = '<i class="row">No bookmarks to show</i>';
    }

    return;
};

const onTAB = async e => {
    const activeTab = await getActiveTabURL();

    const jobid = e.target.parentNode.parentNode.getAttribute("id");

    chrome.tabs.sendMessage(activeTab.id, {
      type: "TAB",
      value: jobid,
    });
};

const onDelete = async e => {
  const activeTab = await getActiveTabURL();

  const jobid = e.target.parentNode.parentNode.getAttribute("id");

  const jobElementToDelete = document.getElementById(jobid);
  jobElementToDelete.parentNode.removeChild(jobElementToDelete);

  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: jobid,
  });
};

const setJobAttributes =  (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentJobId = urlParameters.get("currentJobId");

  if (activeTab.url.includes("linkedin.com/jobs/search/") && currentJobId) {
    chrome.storage.sync.get(["Jobs"], (data) => {
      const currentJobs = data["Jobs"] ? JSON.parse(data["Jobs"]) : [];
      viewJobs(currentJobs);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not Linkedin page with jobs.</div>';
  }
});
