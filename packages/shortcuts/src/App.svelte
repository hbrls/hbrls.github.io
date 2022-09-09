<script>
  import page from 'page';
  import { onMount } from 'svelte';
  import Category from './Category.svelte';
  import TileGroup from './TileGroup.svelte';
  import { categories, active, fav, watch, short } from './stores';
  import * as services from './services';


  page('/shortcuts', function(){
    services.init().then((data) => {
      // console.log(data);
      categories.set(data);
      const defaultCategory = data[0].id;
      active.set(defaultCategory);

      services.load(defaultCategory).then((data) => {
        fav.set(data.fav);
        watch.set(data.watch);
        short.set(data.short);
      });
    });
  });

  page('/shortcuts/public/:category', function ({ params: { category } }) {
    services.load(category).then((data) => {
        fav.set(data.fav);
        watch.set(data.watch);
        short.set(data.short);
        active.set(category);
      });
  });

  onMount(async () => {
    page.start();
  });
</script>

<svelte:window />

<div class="container">
  <div class="row">
    <div class="col-md-2 Menu">
      <ul class="nav nav-pills nav-stacked">
        <!-- svelte-ignore a11y-missing-attribute -->
        <li class="disabled"><a>CATEGORIES</a></li>
        {#each $categories as c}<Category {...c} active="{$active}" />{/each}
      </ul>
    </div>
    <div class="col-md-10">
      <TileGroup title="Fav" dataSource="{$fav}" />
      <TileGroup title="Watch" dataSource="{$watch}" />
      <TileGroup title="Short" dataSource="{$short}" />
    </div>
  </div>
</div>
