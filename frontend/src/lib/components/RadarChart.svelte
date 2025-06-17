<script lang="ts">
  import {
    Chart,
    RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
  } from "chart.js";
  import { onMount } from "svelte";

  import type { Hour } from "../types/hour";

  Chart.register(
    RadarController,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
  );

  const MINUTES_CONVERSION: number = 60000;

  // TODO: need to adjust the time data to be in minutes instead of milliseconds
  //       not sure how to adjust the time to minutes in a nice clean way

  let ctx = document.getElementById("dataChart") as HTMLCanvasElement;

  let { hoursData }: { hoursData: Map<number, Hour> } = $props();

  console.log("hours data: ", hoursData);

  const productiveData: number[] = [];
  const distractionData: number[] = [];

  // fence post the 24th hour first because it's at the top of the 'clock'
  let hour = hoursData.get(24);
  if (hour) {
    productiveData.push(hour.productiveDuration / MINUTES_CONVERSION);
    distractionData.push(hour.distractionDuration / MINUTES_CONVERSION);
  }
  // going from 1 -> 24 to because it maps to the hours better
  for (let i = 1; i < 24; i++) {
    hour = hoursData.get(i);
    if (hour) {
      productiveData.push(hour.productiveDuration / MINUTES_CONVERSION);
      distractionData.push(hour.distractionDuration / MINUTES_CONVERSION);
    }
  }

  // console.log(productiveData); // TESTING
  // console.log(distractionData); // TESTING

  onMount(async () => {
    new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "24",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
        ],
        datasets: [
          {
            label: "productive",
            data: productiveData,
            fill: true,
            backgroundColor: "rgba(0, 128, 128, 0.2)",
            borderColor: "rgba(0, 128, 128)",
          },
          {
            label: "distraction",
            data: distractionData,
            fill: true,
            backgroundColor: "rgba(128, 0, 128, 0.2)",
            borderColor: "rgba(128, 0, 128)",
          },
        ],
      },
      options: {
        elements: {
          line: {
            borderWidth: 3,
          },
        },
        scales: {
          r: {
            beginAtZero: true,
          },
        },
      },
    });
  });
</script>

<div>
  <canvas id="dataChart" width="600" height="600" bind:this={ctx}></canvas>
</div>
