import type { Classification, LogEntry } from "./types";
import { API_BASE_URL } from "./config.js";

// POST

export const postLogEntry = async (
  data: LogEntry
): Promise<{ status: number }> => {
  // post a log entry to the backend
  const res = await fetch(`${API_BASE_URL}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return { status: res.status };
};

export const postSiteClassification = async (
  data: Classification
): Promise<{ status: number }> => {
  const res = await fetch(`${API_BASE_URL}/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return { status: res.status };
};

// GET

export const getSiteClassification = async (
  data: string
): Promise<{ status: number; data: Classification }> => {
  // get site category from classification db
  const encodedUrl = encodeURIComponent(data);
  const res = await fetch(`${API_BASE_URL}/category?url=${encodedUrl}`);
  const json: Classification = await res.json();
  return { status: res.status, data: json };
};
