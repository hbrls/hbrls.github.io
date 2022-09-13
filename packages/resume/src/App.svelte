<script>
  import page from 'page';
  import { onMount } from 'svelte';
  import InfoHeader from './InfoHeader.svelte';
  import Education from './Education.svelte';
  import WorkExperience from './WorkExperience.svelte';
  import { dataSource, lang } from './stores';
  import * as services from './services';


  page('/resume', function() {
    services.load($lang).then((data) => {
      dataSource.set(data);
    });
  });

  // page('/shortcuts/public/:category', function ({ params: { category } }) {
  //   services.load(category).then((data) => {
  //       fav.set(data.fav);
  //       watch.set(data.watch);
  //       short.set(data.short);
  //       active.set(category);
  //     });
  // });

  onMount(async () => {
    page.start();
  });
</script>

<svelte:window />

<div class="resume">
  <InfoHeader name="{$dataSource.name}" email="{$dataSource.email}" />
  <Education dataSource="{$dataSource.education}" />
  <WorkExperience dataSource="{$dataSource.work_experience}" />
</div>
