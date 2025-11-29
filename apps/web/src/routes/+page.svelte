<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { fade, slide } from 'svelte/transition';
	import { convertAPI } from '$lib/api/convert';
	import type { Network } from '@x402-dashboard/shared';
	
	let apiUrl = '';
	let price = '0.01';
	let network: Network = 'polygon-amoy';
	let method = 'GET';
	let description = '';
	let payTo = '';
	let loading = false;
	let error = '';
	let generatedCode: any = null;
	let activeTab = 'express';
	let copied = false;
	
	const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
	const networks: { value: Network; label: string }[] = [
		{ value: 'polygon-amoy', label: 'Polygon Amoy (Testnet)' },
		{ value: 'polygon', label: 'Polygon (Mainnet)' }
	];
	
	async function handleConvert() {
		if (!apiUrl || !price || !payTo) {
			error = 'Please fill in all required fields';
			return;
		}
		
		loading = true;
		error = '';
		generatedCode = null;
		
		try {
			const result = await convertAPI({
				apiUrl,
				price: `$${price}`,
				network,
				method: method as any,
				description,
				payTo
			});
			
			if (result.success) {
				generatedCode = result.generatedCode;
			} else {
				error = result.error || 'Conversion failed';
			}
		} catch (e: any) {
			error = e.message || 'Failed to convert API';
		} finally {
			loading = false;
		}
	}
	
	function copyCode(code: string) {
		navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Header -->
	<header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-3">
					<div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
						<span class="text-white font-bold text-xl">x4</span>
					</div>
					<div>
						<h1 class="text-2xl font-bold text-gray-900 dark:text-white">x402 Dashboard</h1>
						<p class="text-sm text-gray-500 dark:text-gray-400">Monetize your APIs on Polygon</p>
					</div>
				</div>
				
				<!-- Theme Toggle -->
				<button
					on:click={() => theme.toggle()}
					class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
					aria-label="Toggle theme"
				>
					{#if $theme === 'light'}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
						</svg>
					{:else}
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</header>
	
	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="space-y-8" in:fade={{ duration: 300 }}>
			<!-- Hero Section -->
			<div class="text-center space-y-4 animate-slide-in">
				<h2 class="text-4xl font-bold text-gray-900 dark:text-white">
					Convert Your API to x402
				</h2>
				<p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					Transform any API endpoint into a payment-gated API in seconds. Get paid in USDC on Polygon for every request.
				</p>
			</div>
			
			<!-- Conversion Form -->
			<div class="max-w-3xl mx-auto">
				<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 animate-scale-in">
					{#if error}
						<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4" transition:slide>
							<p class="text-red-800 dark:text-red-200">{error}</p>
						</div>
					{/if}
					
					<div class="space-y-6">
						<!-- API URL -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								API Endpoint URL *
							</label>
							<input
								type="text"
								bind:value={apiUrl}
								placeholder="https://api.example.com/data or /api/weather"
								class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
							/>
						</div>
						
						<!-- Method & Network Row -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									HTTP Method
								</label>
								<select
									bind:value={method}
									class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
								>
									{#each methods as m}
										<option value={m}>{m}</option>
									{/each}
								</select>
							</div>
							
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Network
								</label>
								<select
									bind:value={network}
									class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
								>
									{#each networks as net}
										<option value={net.value}>{net.label}</option>
									{/each}
								</select>
							</div>
						</div>
						
						<!-- Price & PayTo Row -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Price (USDC) *
								</label>
								<div class="relative">
									<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
									<input
										type="number"
										step="0.001"
										bind:value={price}
										placeholder="0.01"
										class="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
									/>
								</div>
							</div>
							
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Payment Address *
								</label>
								<input
									type="text"
									bind:value={payTo}
									placeholder="0x..."
									class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-mono text-sm"
								/>
							</div>
						</div>
						
						<!-- Description -->
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Description (Optional)
							</label>
							<textarea
								bind:value={description}
								placeholder="Access to premium weather data"
								rows="2"
								class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
							/>
						</div>
					</div>
					
					<!-- Convert Button -->
					<button
						on:click={handleConvert}
						disabled={loading || !apiUrl || !price || !payTo}
						class="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
					>
						{#if loading}
							<span class="flex items-center justify-center">
								<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Converting...
							</span>
						{:else}
							🚀 Convert to x402 API
						{/if}
					</button>
				</div>
			</div>
			
			<!-- Generated Code Section -->
			{#if generatedCode}
				<div class="max-w-4xl mx-auto animate-slide-in" transition:slide>
					<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
						<div class="flex items-center justify-between">
							<h3 class="text-2xl font-bold text-gray-900 dark:text-white">
								✨ Your x402-Gated API is Ready!
							</h3>
							{#if copied}
								<span class="text-green-600 dark:text-green-400 font-medium animate-fade-in">
									✓ Copied!
								</span>
							{/if}
						</div>
						
						<!-- Tabs -->
						<div class="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
							<button
								on:click={() => activeTab = 'express'}
								class="px-4 py-2 font-medium transition-all {activeTab === 'express' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}"
							>
								Express
							</button>
							<button
								on:click={() => activeTab = 'elysia'}
								class="px-4 py-2 font-medium transition-all {activeTab === 'elysia' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}"
							>
								Elysia
							</button>
							<button
								on:click={() => activeTab = 'config'}
								class="px-4 py-2 font-medium transition-all {activeTab === 'config' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}"
							>
								Config
							</button>
						</div>
						
						<!-- Code Display -->
						<div class="relative">
							<button
								on:click={() => copyCode(activeTab === 'express' ? generatedCode.express : activeTab === 'elysia' ? generatedCode.elysia : generatedCode.config)}
								class="absolute top-4 right-4 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-all"
							>
								Copy
							</button>
							<pre class="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto text-sm"><code>{activeTab === 'express' ? generatedCode.express : activeTab === 'elysia' ? generatedCode.elysia : generatedCode.config}</code></pre>
						</div>
						
						<!-- Instructions -->
						<div class="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 space-y-3">
							<h4 class="font-semibold text-primary-900 dark:text-primary-100">Next Steps:</h4>
							<ol class="list-decimal list-inside space-y-2 text-primary-800 dark:text-primary-200">
								<li>Install the x402 package: <code class="px-2 py-1 bg-primary-100 dark:bg-primary-900 rounded">npm install x402-express</code></li>
								<li>Copy the code above into your server file</li>
								<li>Start your server and test the endpoint</li>
								<li>Share your API URL with clients - they'll pay in USDC automatically!</li>
							</ol>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</main>
</div>

<style>
	:global(.animate-fade-in) {
		animation: fadeIn 0.3s ease-in-out;
	}
	
	:global(.animate-slide-in) {
		animation: slideIn 0.3s ease-out;
	}
	
	:global(.animate-scale-in) {
		animation: scaleIn 0.2s ease-out;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	
	@keyframes slideIn {
		from {
			transform: translateY(10px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	
	@keyframes scaleIn {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>

