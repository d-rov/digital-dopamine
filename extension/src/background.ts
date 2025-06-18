import {
  getSiteClassification,
  postLogEntry,
  postSiteClassification,
} from "./api.js";
import { TimeTracker } from "./utils/timeTracker.js";

/**
 * TODO: code in my listeners has a lot of overlap and similarity, fine for now
 *       - extract is out into some helper functions, might add some complexity
 */

/**
 * I don't think it's necessary to add a listener for a removed/closed tab as a closing window should cover last tab being closed
 * and onActivated should cover a tab being closed as the next tab should trigger the event
 */

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

    // console.log(tab.url);

    const parsed = new URL(tab.url);
    const hostUrl = parsed.host;

    // console.log("host url: ", hostUrl); // TESTING

    const siteCategory = await getSiteClassification(hostUrl);
    console.log(siteCategory.status); // TESTING
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
      // console.log("retVal: ", retVal); // TESTING
    }

    let keepRunning = false;
    if (currUrl === hostUrl) {
      // console.log("keep running");
      keepRunning = true;
    }
    currUrl = hostUrl;

    if (trackerMap.has(hostUrl)) {
      const tracker = trackerMap.get(hostUrl);
      if (!tracker) return "TimeTracker object not found";
      if (!keepRunning) {
        // console.log("starting/restarting time tracker");
        tracker.start(hostUrl);
      }
    } else if (!trackerMap.has(hostUrl)) {
      const timeTracker = new TimeTracker();
      timeTracker.start(hostUrl);
      trackerMap.set(hostUrl, timeTracker);
    }
  } catch (err) {
    console.error("Error in onActivated listener: ", err);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    if (!tab || !tab.url || !tab.id) return;
    if (
      tab.url.startsWith("chrome") ||
      tab.url.includes("localhost") ||
      tab.url.includes("127.0.0.1")
    ) {
      return;
    }

    const parsed = new URL(tab.url);
    const hostUrl = parsed.host;

    const siteCategory = await getSiteClassification(hostUrl);
    console.log(siteCategory.status); // TESTING
    if (siteCategory.status === 404) {
      console.log("site not categorized in database");
      chrome.scripting.executeScript({
        target: { tabId },
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
      // console.log("retVal: ", retVal); // TESTING
    }

    let keepRunning = false;
    if (currUrl === hostUrl) {
      // console.log("keep running");
      keepRunning = true;
    }
    currUrl = hostUrl;

    if (trackerMap.has(hostUrl)) {
      const tracker = trackerMap.get(hostUrl);
      if (!tracker) return "TimeTracker object not found";
      if (!keepRunning) {
        // console.log("starting/restarting time tracker");
        tracker.start(hostUrl);
      }
    } else if (!trackerMap.has(hostUrl)) {
      const timeTracker = new TimeTracker();
      timeTracker.start(hostUrl);
      trackerMap.set(hostUrl, timeTracker);
    }
  } catch (err) {
    console.log("Error in onUpdated listener: ", err);
  }
});

// covers case where a link opens a new tab, etc.
chrome.tabs.onCreated.addListener(async (tab) => {
  console.log("tab created"); // TESTING
  try {
    if (!tab || !tab.url || !tab.id) return;

    const parsed = new URL(tab.url);
    const hostUrl = parsed.host;

    const siteCategory = await getSiteClassification(hostUrl);
    console.log(siteCategory.status); // TESTING
    if (siteCategory.status === 404) {
      console.log("site not categorized in database");
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
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
      // console.log("retVal: ", retVal); // TESTING
    }

    let keepRunning = false;
    if (currUrl === hostUrl) {
      // console.log("keep running");
      keepRunning = true;
    }
    currUrl = hostUrl;

    if (trackerMap.has(hostUrl)) {
      const tracker = trackerMap.get(hostUrl);
      if (!tracker) return "TimeTracker object not found";
      if (!keepRunning) {
        // console.log("starting/restarting time tracker");
        tracker.start(hostUrl);
      }
    } else if (!trackerMap.has(hostUrl)) {
      const timeTracker = new TimeTracker();
      timeTracker.start(hostUrl);
      trackerMap.set(hostUrl, timeTracker);
    }
  } catch (err) {
    console.log("Error in onCreated listener: ", err);
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  console.log("window focus changed: ", windowId); // TESTING
  const tracker = trackerMap.get(currUrl);
  if (!tracker) return "TimeTracker object not found";
  const tabData = tracker.stop();
  postLogEntry(tabData);

  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    console.log("chrome not currently in focus");
    // if the current window id is not WINDOW_ID_NONE then it switched to a new browser so start new time tracker
    // if it is WINDOW_ID_NONE then it switched away so do nothing
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.url || !tab.id) return;

      const parsed = new URL(tab.url);
      const hostUrl = parsed.host;

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
    });
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  console.log("removed window: ", windowId); // TESTING
  // browser window is closing so just stop the time tracker and push to db
  chrome.windows.getLastFocused((lastFocusedWindow) => {
    if (windowId === lastFocusedWindow.id) {
      const tracker = trackerMap.get(currUrl);
      if (!tracker) return "TimeTracker object not found";
      const tabData = tracker.stop();
      postLogEntry(tabData);
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
