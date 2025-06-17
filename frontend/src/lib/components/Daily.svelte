<script lang="ts">
  import type { Hour } from "../types/hour";
  import type { Site } from "../types/site";
  import Chart from "./Chart.svelte";

  const data = $props<{ data: Site[] }>();

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  function addToNewHour(site: Site, hour: Hour, duration: number) {
    let addSite = false
    if (!hour.distractionSites.includes(site.url) && !hour.productiveSites.includes(site.url)) {
      addSite = true
    }
    if (site.category === "distraction") {
      hour.distractionDuration += duration;
      if (addSite) {hour.distractionSites.push(site.url)}
    } else if (site.category === "productive") {
      hour.productiveDuration += duration;
      if (addSite) {hour.productiveSites.push(site.url)}
    }
  }

  // TODO: oh no, going to need to deal with timezones (maybe?)

  // want to collect each block of visits per hour so i can display the daily trends
  // don't want to recreate this every single time visits is updated...
  // not sure how to update the map with just new values atm
  let dataMap = $state(new Map<number, Hour>());

  $effect(() => {
    if (!data) return
    const hoursMap = new Map<number, Hour>();
    // this is wildly inefficient (i think) using a triply-nested for loop
    // how to optimize?
    // loops over 24 hours to create an hour object
    // looping 1 upto and including 24 because it maps to hours more comfortably
    for (let i = 1; i <= 24; i++) {
      // add an hour to the hours map regardless of whether there are entries
      const newHour: Hour = {
        productiveSites: [],
        distractionSites: [],
        productiveDuration: 0,
        distractionDuration: 0,
      };

      // loops over visit data to find all sites and visit time
      for (let s = 0; s < data.length; s++) {
        // check each site and see if it has a start/stop range in the hour
        const site = data[s];

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
            const duration = startStop[1] - startStop[0];
            addToNewHour(site, newHour, duration)
            // ------------------------------------------------------------
          } else if (
            startStop[0] >= startOfHour && // starts after start of hour
            startStop[0] < endOfHour && // starts before end of hour
            startStop[1] > endOfHour // ends after end of hour
          ) {
            console.log("following hour(s) contain");
            // add the site and partial visit to the newHour
            // includes time in following hour
            const duration = endOfHour - startStop[0];
            addToNewHour(site, newHour, duration)
            // ------------------------------------------------------------
          } else if (
            startStop[0] < startOfHour && // starts before start of hour
            startStop[1] > startOfHour && // ends after start of hour
            startStop[1] < endOfHour // ends before end of hour
          ) {
            console.log("previous hour(s) contain");
            // add the site and partial visit to the newHour
            // includes time in previous hour
            const duration = startStop[1] - startOfHour;
            addToNewHour(site, newHour, duration)
            // ------------------------------------------------------------
          } else if (startStop[0] < startOfHour && startStop[1] > endOfHour) {
            console.log("bleeds both sides");
            // add the site and partial visit to the newHour
            // includes time in previous and following hours
            // this should mean that it is the only site in the hour
            const duration = endOfHour - startOfHour;
            addToNewHour(site, newHour, duration)
            // ------------------------------------------------------------
          }
        }
      }
      hoursMap.set(i, newHour);
    }

    console.log(hoursMap);

    dataMap = hoursMap
  }) // end of effect
</script>

<Chart hoursData={dataMap} />
