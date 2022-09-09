import { writable } from 'svelte/store';

export const dataSource = writable({
  name: '',
  title: '',
  education: [],
  work_experience: [],
});

export const lang = writable('zh');
