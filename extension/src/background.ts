import {
  getSiteClassification,
  postLogEntry,
  postSiteClassification,
} from "./api.js";
import { TimeTracker } from "./utils/timeTracker.js";

let currUrl: string = "";
const trackerMap = new Map<string, TimeTracker>();

// onActivated needs to stop time tracking for previous tabId if there is one
// creates a new time tracker if one did not previously exist and then (re)start time tracking for new active tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (!tab || !tab.url || !tab.id) return;
    // need to sanitize for restricted URLs such as chrome://
    const parsed = new URL(tab.url);
    const hostUrl = parsed.host;

    const siteCategory = await getSiteClassification(hostUrl);
    console.log(siteCategory.status);
    if (siteCategory.status === 404) {
      console.log("site not categorized in database");
      chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: ["banner.js"],
      });
    }

    if (currUrl != "" && currUrl !== hostUrl) {
      const tracker = trackerMap.get(currUrl);
      if (!tracker) return "TimeTracker object not found";
      const tabData = tracker.stop();
      const retVal = await postLogEntry(tabData);
      // lets do a little error checking with retVal
      console.log("retVal: ", retVal); // TESTING
    }
    currUrl = hostUrl;

    if (trackerMap.has(hostUrl)) {
      const tracker = trackerMap.get(hostUrl);
      if (!tracker) return "TimeTracker object not found";
      tracker.start(hostUrl);
    } else if (!trackerMap.has(hostUrl)) {
      const timeTracker = new TimeTracker();
      timeTracker.start(hostUrl);
      trackerMap.set(hostUrl, timeTracker);
    }
  } catch (err) {
    console.error("Error in onActivated listener: ", err);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`ChangeInfo: ${changeInfo}`); // TESTING
  if (changeInfo.url) {
    console.log(changeInfo.url); // TESTING
  }
});

chrome.runtime.onMessage.addListener((message) => {
  console.log("Message received in background");
  if (message.type === "classifySite") {
    const retVal = postSiteClassification(message.payload);
    console.log("postSiteClassification retVal: ", retVal);
  }
});
