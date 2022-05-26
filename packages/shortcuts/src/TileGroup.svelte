<script>
  import Tile from './Tile.svelte';

  export let title;
  export let dataSource;
</script>

<div class="row">
  <div class="col-md-2 TileTitle">{title}</div>
</div>
<div class="row TileGroup">
  {#each dataSource as t}
  <Tile {...t} />
  {/each}
</div>


<style>
  .TileGroup {
    margin-bottom: 15px;
  }

  .TileTitle {
    color: #a59a96;
    font-weight: bold;
    font-style: italic;
    line-height: 280%;
    text-transform: uppercase;
  }
</style>
