<script>
  export let employer;
  export let position;
  export let start_date;
  export let end_date;
  export let descriptions;
</script>

<li>
  <div class="info">
    <strong class="employer">{employer}</strong><br />
    <strong class="position">{position}</strong><br />
    <span class="dates">{start_date} ~ {end_date}</span>
  </div>
  <ul>
    {#each descriptions as d}
    <li>{d}</li>
    {/each}
  </ul>
</li>

<style>
</style>
