<script lang="ts">
  import { Chart } from "chart.js";
  import type { Hour } from "../types/hour";

  let { hoursData }: { hoursData: Map<number, Hour> } = $props();

  const ctx = document.getElementById("dataChart");

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
          // data: []
        },
        {
          label: "distraction",
        },
      ],
    },
  });
</script>

<div>
  <canvas id="dataChart"></canvas>
</div>
