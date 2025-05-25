import type { LogEntry } from "./types";
import { API_BASE_URL } from "./config.js";

export const postLogEntry = async (data: LogEntry) => {
  // post a log entry to the backend
  const res = await fetch(`${API_BASE_URL}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
