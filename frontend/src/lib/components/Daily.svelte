<script lang="ts">
  import type { Hour } from "../types/hour";
  import type { Site } from "../types/site";
  import Chart from "./Chart.svelte";

  let { data }: { data: Site[] } = $props();

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  // TODO: there is a lot of redundant code here but atm not sure how to fix that without a lot of pain
  // TODO: oh no, going to need to deal with timezones (maybe?)

  // want to collect each block of visits per hour so i can display the daily trends
  // don't want to recreate this every single time visits is updated...
  // not sure how to update the map with just new values atm
  const hoursMap = new Map<number, Hour>();

  // this is wildly inefficient (i think) using a triply-nested for loop
  // how to optimize?
  // loops over 24 hours to create an hour object
  for (let i = 0; i < 24; i++) {
    // add an hour to the hours map regardless of whether there are entries
    const newHour: Hour = {
      sites: [],
      productiveDuration: 0,
      distractionDuration: 0,
    };

    // loops over visit data to find all sites and visit time
    for (let s = 0; s < data.length; s++) {
      // check each site and see if it has a start/stop range in the hour
      const site = data[s];
      const siteUrl = site.url;

      // loops over start/stop time visits for each site to see if and how much time was spent on that site during this hour
      const visitTimes = site.visits;
      for (let t = 0; t < visitTimes.length; t++) {
        // get amount of time from the site in the hour to add to hour data
        const currentHour = 3600000 * i;
        const currentHourEnd = 3600000 * (i + 1);
        const startOfHour = startOfToday + currentHour;
        const endOfHour = startOfToday + currentHourEnd;
        const startStop = visitTimes[t];

        // create a durationInHour const that is the amount of time that site was active during the hour
        if (startStop[0] >= startOfHour && startStop[1] < endOfHour) {
          console.log("fully contained");
          // add the site and whole visit to the newHour
          // entire time is contained within current hour
          if (!newHour.sites.includes(site.url)) {
            newHour.sites.push(siteUrl);
          }
          const duration = startStop[1] - startStop[0];
          if (site.category === "distraction") {
            newHour.distractionDuration += duration;
          } else if (site.category === "productive") {
            newHour.productiveDuration += duration;
          }
        } else if (
          startStop[0] >= startOfHour && // starts after start of hour
          startStop[0] < endOfHour && // starts before end of hour
          startStop[1] > endOfHour // ends after end of hour
        ) {
          console.log("following hour(s) contain");
          // add the site and partial visit to the newHour
          // includes time in following hour
          if (!newHour.sites.includes(site.url)) {
            newHour.sites.push(siteUrl);
          }
          const duration = endOfHour - startStop[0];
          if (site.category === "distraction") {
            newHour.distractionDuration += duration;
          } else if (site.category === "productive") {
            newHour.productiveDuration += duration;
          }
        } else if (
          startStop[0] < startOfHour && // starts before start of hour
          startStop[1] > startOfHour && // ends after start of hour
          startStop[1] < endOfHour // ends before end of hour
        ) {
          console.log("previous hour(s) contain");
          // add the site and partial visit to the newHour
          // includes time in previous hour
          if (!newHour.sites.includes(site.url)) {
            newHour.sites.push(siteUrl);
          }
          const duration = startStop[1] - startOfHour;
          if (site.category === "distraction") {
            newHour.distractionDuration += duration;
          } else if (site.category === "productive") {
            newHour.productiveDuration += duration;
          }
        } else if (startStop[0] < startOfHour && startStop[1] > endOfHour) {
          console.log("bleeds both sides");
          // add the site and partial visit to the newHour
          // includes time in previous and following hours
          // this should mean that it is the only site in the hour
          if (!newHour.sites.includes(site.url)) {
            newHour.sites.push(siteUrl);
          }
          const duration = endOfHour - startOfHour;
          if (site.category === "distraction") {
            newHour.distractionDuration += duration;
          } else if (site.category === "productive") {
            newHour.productiveDuration += duration;
          }
        }
      }
    }
    hoursMap.set(i, newHour);
  }

  console.log(hoursMap);
</script>

<!-- {#each hoursMap.entries() as [key, value]}
  <p>
    {key}: {value.sites}, {value.distractionDuration | value.productiveDuration}
  </p>
{/each} -->

<Chart hoursData={hoursMap} />
