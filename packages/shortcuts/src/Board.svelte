<script>
import { createQuery } from '@tanstack/svelte-query';
import TileGroup from './TileGroup.svelte';
import * as rpc from './rpc';

export let category;
// console.log(category);

$: query = createQuery({
  queryKey: [ 'collections', category ],
  queryFn: () => rpc.load(category),
  enabled: category != 'none',
  staleTime: Infinity,
});
</script>

<div class="col-md-10">

  {#if $query.isLoading}
    <p>Loading...</p>
  {:else if $query.isError}
    <p>Error: {$query.error.message}</p>
  {:else if $query.isSuccess}
    <TileGroup title="Fav" dataSource="{$query.data.fav}" />
    <TileGroup title="Watch" dataSource="{$query.data.watch}" />
    <TileGroup title="Short" dataSource="{$query.data.short}" />
  {/if}
</div>
