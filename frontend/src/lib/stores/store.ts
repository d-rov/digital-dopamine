import { writable } from "svelte/store";
import type { Site } from "../types/site";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(baseUrl);

const visits: Site[] = [];

export const siteVisits = writable(visits, (set) => {
  // make fetch to /api/summary?period={day|week|month}

  async function fetchData() {
    try {
      const res = await fetch(`${baseUrl}/summary`);
      const json: Site[] = await res.json();
      console.log("json: ", json);
      set(json);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  fetchData();
  return;
});
