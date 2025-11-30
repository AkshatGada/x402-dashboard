<script lang="ts">
	import { onMount } from 'svelte';
	import { wallet } from '$lib/stores/wallet';
	import { connectWallet, disconnectWallet, initWeb3Auth } from '$lib/wallet/web3auth';
	import { fade, slide } from 'svelte/transition';

	let initializing = false;
	let showDropdown = false;

	onMount(async () => {
		wallet.init();
		// Try to initialize Web3Auth if wallet address exists
		if ($wallet.address) {
			try {
				initializing = true;
				await initWeb3Auth();
			} catch (error) {
				console.error('Failed to initialize Web3Auth:', error);
			} finally {
				initializing = false;
			}
		}
	});

	async function handleConnect() {
		try {
			await connectWallet();
			showDropdown = false;
		} catch (error) {
			console.error('Connection error:', error);
		}
	}

	async function handleDisconnect() {
		try {
			await disconnectWallet();
			showDropdown = false;
		} catch (error) {
			console.error('Disconnect error:', error);
		}
	}

	function formatAddress(address: string): string {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}
</script>

<div class="relative">
	{#if $wallet.isConnected && $wallet.address}
		<!-- Connected Wallet Button -->
		<button
			on:click={toggleDropdown}
			class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
			</svg>
			<span class="font-medium">{formatAddress($wallet.address)}</span>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<!-- Dropdown Menu -->
		{#if showDropdown}
			<div
				class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
				transition:slide={{ axis: 'y', duration: 200 }}
				on:click|stopPropagation
			>
				<div class="p-4 space-y-3">
					<div class="pb-3 border-b border-gray-200 dark:border-gray-700">
						<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Connected Wallet</p>
						<p class="font-mono text-sm text-gray-900 dark:text-white break-all">{$wallet.address}</p>
					</div>
					
					<button
						on:click={handleDisconnect}
						disabled={$wallet.isLoading}
						class="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						<span>Disconnect</span>
					</button>
				</div>
			</div>
		{/if}
	{:else}
		<!-- Connect Wallet Button -->
		<button
			on:click={handleConnect}
			disabled={$wallet.isLoading || initializing}
			class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
		>
			{#if $wallet.isLoading || initializing}
				<svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
				<span>Connecting...</span>
			{:else}
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
				<span>Connect Wallet</span>
			{/if}
		</button>
	{/if}

	{#if $wallet.error}
		<div
			class="absolute right-0 mt-2 w-64 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 z-50"
			transition:fade
		>
			<p class="text-sm text-red-800 dark:text-red-200">{$wallet.error}</p>
		</div>
	{/if}
</div>

<!-- Click outside to close dropdown -->
{#if showDropdown}
	<div
		class="fixed inset-0 z-40"
		on:click={() => (showDropdown = false)}
		transition:fade
	></div>
{/if}

<style>
	:global(.animate-spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>

