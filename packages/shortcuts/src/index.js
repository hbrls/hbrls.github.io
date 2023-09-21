import $find from 'vanilla.js/jquery/find';
import { $script } from '@head/container';
import $client from './edge';
import App from './App.svelte';


$script('$$', 'http', $client);


const app = new App({
	target: $find('.App'),
});

export default app;
