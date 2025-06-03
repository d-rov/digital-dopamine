<script lang="ts">
  import { siteVisits } from "../stores/store";

  $: visits = $siteVisits;
</script>

{#if visits.length > 1}
  {#each visits as visit}
    <p>visit url is {visit.url}, visit duration is {visit.totalDuration}</p>
  {/each}
{/if}
