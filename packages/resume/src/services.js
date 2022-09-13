import $client from './edge';


export async function load(lang) {
  const { data } = await $client.get(`/resume/api/${lang}`);
  return data;
}
