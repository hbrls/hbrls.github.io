<script>
  import WorkExperienceItem from './WorkExperienceItem.svelte';
  export let dataSource;
</script>

<section class="work-experience">
  <h2>工作经历</h2>
  <ul>
    {#each dataSource as i}
    <WorkExperienceItem {...i} />
    {/each}
  </ul>
</section>

<!-- var title = "Education";
if (this.props.lang === 'zh') {
  title = "教育背景";
} -->

<style>
</style>