import $find from 'vanilla.js/jquery/find';
import App from './App.svelte';


const app = new App({
	target: $find('.App'),
});

export default app;