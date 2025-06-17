import {
  getSiteClassification,
  postLogEntry,
  postSiteClassification,
} from "./api.js";
import { TimeTracker } from "./utils/timeTracker.js";

// TODO: if when switching between tabs and base url is same for previous and new sites then time tracking should continue
// TODO: setup updating url/tab instead of just clicking onto the tab
// TODO: setup stop time tracker for closing tab
// TODO: setup functionality for exiting browsing

let currUrl: string = "";
const trackerMap = new Map<string, TimeTracker>();

// onActivated needs to stop time tracking for previous tabId if there is one
// creates a new time tracker if one did not previously exist and then (re)start time tracking for new active tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (!tab || !tab.url || !tab.id) return;
    if (
      tab.url.startsWith("chrome") ||
      tab.url.includes("localhost") ||
      tab.url.includes("127.0.0.1")
    ) {
      return;
    }

    console.log(tab.url);

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
      console.log("tabData: ", tabData.url, tabData.duration); // TESTING
      const retVal = await postLogEntry(tabData);
      // TODO: add error checking for retVal
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
