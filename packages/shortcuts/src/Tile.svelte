<script>
  export let id;
  export let url;
  export let icon = 'progress-question';
</script>

<div class="col-md-2 Tile Tile-{id}">
  <div class="Tile-outer">
    <div class="Tile-inner">
      <a class="" href="{url}" target="_blank" rel="noreferrer">
        <span><i class="mdi mdi-{icon}"></i>{id}</span>
      </a>
    </div>
  </div>
</div>

<style>
	.Tile {
    margin-bottom: 15px;
  }

	.Tile-outer {
    padding: 6px;
    background-color: #f9f8f4;
    border: 1px solid #fefefe;
    box-shadow: 0px 0px 2px #dbdbdb;
  }

  .Tile-inner {
    font-size: 12px;
  }

  .Tile-inner a {
    display: block;
    white-space: nowrap;
  }

  .Tile-inner a i.mdi {
    margin-right: 6px;
    font-size: 14px;
    vertical-align: middle;
  }
</style>
