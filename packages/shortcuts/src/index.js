import $find from 'vanilla.js/jquery/find';
import { html, render } from 'lit';
import { $script } from '@head/container';
import $client from './edge';
import App from './App.svelte';
import './PowerBy';


$script('$$', 'edge', $client);


new App({
	target: $find('.App'),
});


render(html`<power-by since="2012"></power-by>`, $find('footer'));
