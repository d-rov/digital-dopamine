<script lang="ts">
  import {
    Chart,
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
    Legend,
  } from "chart.js";
  import { onMount } from "svelte";
  import type { Hour } from "../types/hour";

  Chart.register(BarController, CategoryScale, LinearScale, BarElement, Legend);

  const MINUTES_CONVERSION: number = 60000;

  let ctx = document.getElementById("dataChart") as HTMLCanvasElement;

  let { data }: { data: Map<number, Hour> } = $props();

  const labels: number[] = [];
  const productiveData: number[] = [];
  const distractionData: number[] = [];

  // fence post the 24th hour first because it's at the top of the 'clock'
  // going from 1 -> 24 to because it maps to the hours better
  for (let i = 1; i <= 24; i++) {
    let hour = data.get(i);
    if (hour) {
      labels.push(i);
      productiveData.push(hour.productiveDuration / MINUTES_CONVERSION);
      distractionData.push(hour.distractionDuration / MINUTES_CONVERSION);
    }
  }

  onMount(async () => {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Productive",
            data: productiveData,
            backgroundColor: "rgba(0, 128, 128, 0.8)",
            borderColor: "rgba(0, 128, 128)",
            borderWidth: 2,
          },
          {
            label: "Distraction",
            data: distractionData,
            backgroundColor: "rgba(128, 0, 128, 0.8)",
            borderColor: "rgba(128, 0, 128)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
</script>

<div>
  <canvas id="dataChart" width="800" height="400" bind:this={ctx}></canvas>
</div>
