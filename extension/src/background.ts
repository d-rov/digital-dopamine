import { postLogEntry } from "./api.js";
import { TimeTracker } from "./utils/timeTracker.js";

let currTab: number = 0;
const trackerMap = new Map<number, TimeTracker>();

// onActivated needs to stop time tracking for previous tabId if there is one
// creates a new time tracker if one did not previously exist and then (re)start time tracking for new active tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (!tab || !tab.url || !tab.id) return;
    console.log(tab.url);
    console.log(tab.id);
    // check if currTab does != tab.id and stop previous time tracker
    // set new currTab to tab.id
    if (currTab && currTab !== tab.id) {
      const tracker = trackerMap.get(currTab);
      if (!tracker) return "TimeTracker object not found";
      const tabData = tracker.stop();
      // do I want to add a line into the db here?
      console.log(tabData);
      const retVal = postLogEntry(tabData);
      // lets do a little error checking with retVal
      currTab = tab.id;
    }
    if (trackerMap.has(tab.id)) {
      const tracker = trackerMap.get(tab.id);
      if (!tracker) return "TimeTracker object not found";
      tracker.start(tab.url);
    } else if (!trackerMap.has(tab.id)) {
      const timeTracker = new TimeTracker();
      timeTracker.start(tab.url);
      trackerMap.set(tab.id, timeTracker);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log(changeInfo.url);
  }
});
