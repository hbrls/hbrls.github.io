import { writable } from 'svelte/store';

export const categories = writable([]);

export const active = writable('none');
