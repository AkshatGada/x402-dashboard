import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Web3Auth } from '@web3auth/modal';
import type { WalletClient } from 'viem';

export interface WalletState {
	isConnected: boolean;
	address: string | null;
	web3auth: Web3Auth | null;
	walletClient: WalletClient | null;
	isLoading: boolean;
	error: string | null;
}

function createWalletStore() {
	const { subscribe, set, update } = writable<WalletState>({
		isConnected: false,
		address: null,
		web3auth: null,
		walletClient: null,
		isLoading: false,
		error: null
	});

	return {
		subscribe,
		setLoading: (loading: boolean) => {
			update((state) => ({ ...state, isLoading: loading }));
		},
		setError: (error: string | null) => {
			update((state) => ({ ...state, error, isLoading: false }));
		},
		setConnected: (address: string, web3auth: Web3Auth, walletClient: WalletClient) => {
			update((state) => ({
				...state,
				isConnected: true,
				address,
				web3auth,
				walletClient,
				isLoading: false,
				error: null
			}));
		},
		setDisconnected: () => {
			update((state) => ({
				...state,
				isConnected: false,
				address: null,
				web3auth: null,
				walletClient: null,
				isLoading: false,
				error: null
			}));
		},
		init: () => {
			if (browser) {
				// Check if already connected
				const stored = localStorage.getItem('wallet_address');
				if (stored) {
					update((state) => ({
						...state,
						address: stored,
						isConnected: true
					}));
				}
			}
		}
	};
}

export const wallet = createWalletStore();

