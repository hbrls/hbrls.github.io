import $http from '@head/container/$$/http';


export async function init() {
  const { data } = await $http.get('/shortcuts/api/categories');
  return data;
}


export async function load(category) {
  const { data } = await $http.get(`/shortcuts/api/categories/${category}/collections`);
  return data;
}
