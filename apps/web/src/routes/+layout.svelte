<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';
	import { browser } from '$app/environment';
	
	onMount(async () => {
		theme.init();
		
		// Initialize polyfills for Web3Auth
		if (browser) {
			try {
				const { Buffer } = await import('buffer');
				const process = await import('process/browser');
				
				// @ts-ignore
				window.Buffer = Buffer;
				// @ts-ignore
				window.process = process;
				// @ts-ignore
				window.global = window;
			} catch (error) {
				console.warn('Failed to load polyfills:', error);
			}
		}
	});
</script>

<div class="app min-h-screen">
	<slot />
</div>


