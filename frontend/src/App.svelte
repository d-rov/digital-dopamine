<script lang="ts">
  import { dailySites } from "./lib/stores/store";
  import Daily from "./lib/components/Daily.svelte";
</script>

<main>
  {#if $dailySites}
    <Daily data={$dailySites} />
  {/if}
</main>

<style>
</style>
