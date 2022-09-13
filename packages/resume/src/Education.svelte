<script>
  import EducationItem from './EducationItem.svelte';
  export let dataSource;
</script>

<section class="education">
  <h2>教育背景</h2>
  <ul>
    {#each dataSource as i}
    <EducationItem {...i} />
    {/each}
  </ul>
</section>

<!-- var title = "Education";
if (this.props.lang === 'zh') {
  title = "教育背景";
} -->

<style>
</style>