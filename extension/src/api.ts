import type { Classification, LogEntry } from "./types";
import { API_BASE_URL } from "./config.js";

export const postLogEntry = async (
  data: LogEntry
): Promise<{ status: number; data: LogEntry[] }> => {
  // post a log entry to the backend
  const res = await fetch(`${API_BASE_URL}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json: LogEntry[] = await res.json();
  return { status: res.status, data: json };
};

export const getSiteClassification = async (
  data: string
): Promise<{ status: number; data: Classification }> => {
  // get site category from classification db
  const encodedUrl = encodeURIComponent(data);
  const res = await fetch(`${API_BASE_URL}/category?url=${encodedUrl}`);
  const json: Classification = await res.json();
  return { status: res.status, data: json };
};
