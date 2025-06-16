<script lang="ts">
  import { siteVisits } from "./lib/stores/store";
  import Daily from "./lib/components/Daily.svelte";
</script>

<main>
  <h1>Hello World!</h1>
  <Daily data={$siteVisits} />
</main>

<style>
</style>
