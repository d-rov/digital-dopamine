import {
  getSiteClassification,
  postLogEntry,
  postSiteClassification,
} from "./api.js";
import { TimeTracker } from "./utils/timeTracker.js";

let currUrl: string = "";
const trackerMap = new Map<string, TimeTracker>();

async function categorizeSite(url: string, tabId: number) {
  const siteCategory = await getSiteClassification(url);
  if (siteCategory.status === 404) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ["banner.js"],
    });
  }
}

function stopTimeTracker(currUrl: string) {
  const tracker = trackerMap.get(currUrl);
  if (!tracker) return "TimeTracker object not found";
  const tabData = tracker.stop();
  console.log("tabData: ", tabData); // TESTING
  postLogEntry(tabData);
}

function startTimeTracker(url: string, keepRunning: boolean) {
  if (trackerMap.has(url)) {
    const tracker = trackerMap.get(url);
    if (!tracker) return "TimeTracker object not found";
    if (!keepRunning) {
      console.log("starting tracker"); // TESTING
      tracker.start(url);
    }
  } else if (!trackerMap.has(url)) {
    const tracker = new TimeTracker();
    console.log("starting new tracker"); // TESTING
    tracker.start(url);
    trackerMap.set(url, tracker);
  }
}

// onActivated needs to stop time tracking for previous tabId if there is one
// creates a new time tracker if one did not previously exist and then (re)start time tracking for new active tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log("tab activated");
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (!tab || !tab.url || !tab.id) return;
    if (
      tab.url.startsWith("chrome") ||
      tab.url.includes("localhost") ||
      tab.url.includes("127.0.0.1")
    ) {
      if (currUrl !== "") stopTimeTracker(currUrl);
      return;
    }

    const parsed = new URL(tab.url);
    const hostUrl = parsed.host;

    categorizeSite(hostUrl, activeInfo.tabId);
    if (currUrl != "" && currUrl !== hostUrl) {
      console.log("activated stop"); // TESTING
      stopTimeTracker(currUrl);
    }
    let keepRunning = currUrl === hostUrl;
    currUrl = hostUrl;
    console.log("activated start"); // TESTING
    startTimeTracker(hostUrl, keepRunning);
  } catch (err) {
    console.error("Error in onActivated listener: ", err);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  console.log("tab updated: ", tab.url);
  try {
    if (!tab || !tab.url || !tab.id) return;
    if (
      tab.url.startsWith("chrome") ||
      tab.url.includes("localhost") ||
      tab.url.includes("127.0.0.1")
    ) {
      if (currUrl !== "") stopTimeTracker(currUrl);
      return;
    }

    const parsed = new URL(tab.url);
    const hostUrl = parsed.host;

    categorizeSite(hostUrl, tabId);
    if (currUrl != "" && currUrl !== hostUrl) {
      console.log("updated stop"); // TESTING
      stopTimeTracker(currUrl);
    }
    let keepRunning = currUrl === hostUrl;
    currUrl = hostUrl;
    console.log("updated start"); // TESTING
    startTimeTracker(hostUrl, keepRunning);
  } catch (err) {
    console.log("Error in onUpdated listener: ", err);
  }
});

chrome.tabs.onCreated.addListener(async (tab) => {
  console.log("tab created"); // TESTING
  try {
    if (!tab || !tab.url || !tab.id) return;

    const parsed = new URL(tab.url);
    const hostUrl = parsed.host;

    categorizeSite(hostUrl, tab.id);
    if (currUrl != "" && currUrl !== hostUrl) {
      console.log("created stop"); // TESTING
      stopTimeTracker(currUrl);
    }
    let keepRunning = currUrl === hostUrl;
    currUrl = hostUrl;
    console.log("created start"); // TESTING
    startTimeTracker(hostUrl, keepRunning);
  } catch (err) {
    console.log("Error in onCreated listener: ", err);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  console.log("focus change stop"); // TESTING
  stopTimeTracker(currUrl);
  currUrl = "";

  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    console.log("chrome not currently in focus");
    // if the current window id is not WINDOW_ID_NONE then it switched to a new browser so start new time tracker
    // if it is WINDOW_ID_NONE then it switched away so do nothing
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.url || !tab.id) return;
      if (
        tab.url.startsWith("chrome") ||
        tab.url.includes("localhost") ||
        tab.url.includes("127.0.0.1")
      ) {
        if (currUrl !== "") stopTimeTracker(currUrl);
        return;
      }

      const parsed = new URL(tab.url);
      const hostUrl = parsed.host;

      let keepRunning = currUrl === hostUrl;
      currUrl = hostUrl;

      console.log("focus change start"); // TESTING
      startTimeTracker(hostUrl, keepRunning);
    });
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  console.log("removed window: ", windowId); // TESTING
  // browser window is closing so just stop the time tracker and push to db
  chrome.windows.getLastFocused((lastFocusedWindow) => {
    if (windowId === lastFocusedWindow.id) {
      stopTimeTracker(currUrl);
    }
    console.log("closed non-focused window");
  });
});

chrome.runtime.onMessage.addListener((message) => {
  console.log("Message received in background");
  if (message.type === "classifySite") {
    const retVal = postSiteClassification(message.payload);
    console.log("postSiteClassification retVal: ", retVal);
  }
});
