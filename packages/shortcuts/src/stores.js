import { writable } from 'svelte/store';

export const categories = writable([]);

export const active = writable('none');

export const fav = writable([]);

export const watch = writable([]);

export const short = writable([]);
