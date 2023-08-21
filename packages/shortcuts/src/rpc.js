import $client from './edge';


export async function init() {
  const { data } = await $client.get('/shortcuts/api/categories');
  return data;
}


export async function load(category) {
  const { data } = await $client.get(`/shortcuts/api/categories/${category}/collections`);
  return data;
}
