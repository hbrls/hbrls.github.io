<script>
  export let id;
  export let name;
  export let active;
</script>


<li class="{id === active ? 'active' : ''}">
  <a href="/shortcuts/public/{id}">{name}</a>
</li>
