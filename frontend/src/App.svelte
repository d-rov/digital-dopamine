<script lang="ts">
  import { siteVisits } from "./lib/stores/store";
  import Daily from "./lib/components/Daily.svelte";
</script>

<main>
  {#if $siteVisits}
    <Daily data={$siteVisits} />
  {/if}
</main>

<style>
</style>
