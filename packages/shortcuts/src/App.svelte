<script>
  import page from 'page';
  import { onMount } from 'svelte';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import Category from './Category.svelte';
  import Board from './Board.svelte';
  import { categories, active } from './store';
  import * as rpc from './rpc';


  const queryClient = new QueryClient();


  page('/shortcuts', function(){
    rpc.init().then((data) => {
      // console.log(data);
      categories.set(data);
      const defaultCategory = data[0].id;
      active.set(defaultCategory);
    });
  });

  page('/shortcuts/public/:category', function ({ params: { category } }) {
    active.set(category);
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
    <QueryClientProvider client={queryClient}>
      <Board category={$active} />
    </QueryClientProvider>
  </div>
</div>
