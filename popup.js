import { getActiveTabURL } from "./utils.js";

const addNewBookmark = (jobs, job) => {
  const JobsIDElement = document.createElement("div");
  const newJobElement = document.createElement("div");

  JobsIDElement.textContent = job.ID;
  JobsIDElement.className = "job-id";

  newJobElement.className = "job";
  newJobElement.setAttribute("id:", job.ID);

  newJobElement.appendChild(JobsIDElement);
  jobs.appendChild(newJobElement);
};

const viewBookmarks = (currentJobs=[]) => {
    const JobsElements = document.getElementById("jobs");
    JobsElements.innerHTML = "";

    if (currentJobs.length > 0) {
        for (let i = 0; i < currentJobs.length; i++) {
            const job = currentJobs[i];
            // console.log(job);
            addNewBookmark(JobsElements, job);
        }
    } else {
    JobsElements.innerHTML = '<i class="row">No bookmarks to show</i>';
    }

    return;
};

const onPlay = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: bookmarkTime,
  }, viewBookmarks);
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
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

  const currentVideo = urlParameters.get("currentJobId");

  if (activeTab.url.includes("linkedin.com/jobs/search/") && currentVideo) {
    console.log("rect");
    chrome.storage.sync.get(["Jobs"], (data) => {
      const currentJobs = data["Jobs"] ? JSON.parse(data["Jobs"]) : [];
      console.log(currentJobs);

      viewBookmarks(currentJobs);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not Linkedin page with jobs.</div>';
  }
});
