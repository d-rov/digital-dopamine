import { LogEntry } from "../types";

export class TimeTracker {
  url: string;
  startTime: number;
  duration: number;

  constructor() {
    this.url = "";
    this.startTime = 0;
    this.duration = 0;
  }

  start(url: string): void {
    // start the time tracker
    this.url = url;
    this.startTime = Date.now();
    this.duration = 0;
  }

  stop(): LogEntry {
    // stop the time tracker
    const duration = Date.now() - this.startTime;
    this.duration += duration;
    const result = { url: this.url, timestamp: this.startTime, duration };
    return result;
  }
}
