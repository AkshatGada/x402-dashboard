<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';
	import { browser } from '$app/environment';
	
	onMount(async () => {
		theme.init();
		
		// Initialize polyfills for Web3Auth (browser only)
		if (browser) {
			try {
				const { Buffer } = await import('buffer');
				const processModule = await import('process/browser');
				
				// @ts-ignore
				if (!window.Buffer) window.Buffer = Buffer;
				// @ts-ignore
				if (!window.process) window.process = processModule;
				// @ts-ignore
				if (!window.global) window.global = window;
			} catch (error) {
				console.warn('Failed to load polyfills:', error);
			}
		}
	});
</script>

<div class="app min-h-screen">
	<slot />
</div>


