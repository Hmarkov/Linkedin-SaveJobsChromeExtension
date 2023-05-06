chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("linkedin.com/jobs/search/")) {
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
      console.log(urlParameters);
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        JobID: urlParameters.get("currentJobId"),
      });
    }
  });