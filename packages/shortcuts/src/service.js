import $edge from '@head/container/$$/edge';


export async function init() {
  const { data } = await $edge.get('/shortcuts/api/categories');
  return data;
}


export async function load(category) {
  const { data } = await $edge.get(`/shortcuts/api/categories/${category}/collections`);
  return data;
}
