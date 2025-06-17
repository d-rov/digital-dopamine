import { readable } from "svelte/store";
import type { Site } from "../types/site";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
console.log(baseUrl);

const visits: Site[] = [];

export const siteVisits = readable(visits, (set) => {
  // make fetch to /api/summary?period={day|week|month}
  async function fetchData() {
    try {
      const res = await fetch(`${baseUrl}/summary`);
      const json: Site[] = await res.json();
      // console.log("json: ", json); // TESTING
      set(json);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  fetchData();

  const interval = setInterval(() => {
    fetchData();
  }, 10000); // don't need this frequent of update in production, purely for testing

  return () => clearInterval(interval);
});
