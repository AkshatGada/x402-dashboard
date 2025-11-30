import { Web3Auth, WEB3AUTH_NETWORK } from '@web3auth/modal';
import { createWalletClient, custom, getAddress } from 'viem';
import { polygon, polygonAmoy } from 'viem/chains';
import { wallet } from './wallet';
import { browser } from '$app/environment';

// Get Web3Auth Client ID from environment
const WEB3AUTH_CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || '';

// Initialize Web3Auth instance
let web3authInstance: Web3Auth | null = null;

export async function initWeb3Auth(): Promise<Web3Auth> {
	if (!browser) {
		throw new Error('Web3Auth can only be initialized in browser');
	}

	if (web3authInstance) {
		return web3authInstance;
	}

	if (!WEB3AUTH_CLIENT_ID) {
		throw new Error('VITE_WEB3AUTH_CLIENT_ID is not set in environment variables. Please create a .env file with your Web3Auth Client ID.');
	}

	// Ensure polyfills are loaded
	if (typeof window !== 'undefined') {
		try {
			if (!window.Buffer) {
				const { Buffer } = await import('buffer');
				// @ts-ignore
				window.Buffer = Buffer;
			}
			if (!window.process) {
				const process = await import('process/browser');
				// @ts-ignore
				window.process = process;
			}
			// @ts-ignore
			if (!window.global) {
				// @ts-ignore
				window.global = window;
			}
		} catch (error) {
			console.warn('Failed to load polyfills:', error);
		}
	}

	const web3auth = new Web3Auth({
		clientId: WEB3AUTH_CLIENT_ID,
		web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // Use DEVNET for development
		chainConfig: {
			chainNamespace: 'eip155',
			chainId: '0x13882', // Polygon Amoy testnet (80002)
			rpcTarget: 'https://rpc-amoy.polygon.technology',
			displayName: 'Polygon Amoy',
			blockExplorer: 'https://amoy.polygonscan.com',
			ticker: 'MATIC',
			tickerName: 'MATIC'
		}
	});

	await web3auth.init();
	web3authInstance = web3auth;

	return web3auth;
}

export async function connectWallet(): Promise<string> {
	try {
		wallet.setLoading(true);
		wallet.setError(null);

		const web3auth = await initWeb3Auth();

		// Connect to Web3Auth
		const web3authProvider = await web3auth.connect();

		if (!web3authProvider) {
			throw new Error('Failed to connect to Web3Auth');
		}

		// Get the chain ID to determine which network
		const chainId = await web3authProvider.request({ method: 'eth_chainId' });
		const selectedChain = chainId === '0x89' ? polygon : polygonAmoy; // 0x89 = Polygon mainnet

		// Create wallet client with viem
		const walletClient = createWalletClient({
			chain: selectedChain,
			transport: custom(web3authProvider)
		});

		// Get connected accounts
		const [address] = await walletClient.getAddresses();
		const normalizedAddress = getAddress(address);

		// Store wallet state
		wallet.setConnected(normalizedAddress, web3auth, walletClient);

		// Persist to localStorage
		if (browser) {
			localStorage.setItem('wallet_address', normalizedAddress);
		}

		return normalizedAddress;
	} catch (error: any) {
		const errorMessage = error?.message || 'Failed to connect wallet';
		wallet.setError(errorMessage);
		throw error;
	} finally {
		wallet.setLoading(false);
	}
}

export async function disconnectWallet(): Promise<void> {
	try {
		wallet.setLoading(true);

		const web3auth = web3authInstance;
		if (web3auth) {
			await web3auth.logout();
		}

		wallet.setDisconnected();

		if (browser) {
			localStorage.removeItem('wallet_address');
		}
	} catch (error: any) {
		wallet.setError(error?.message || 'Failed to disconnect wallet');
		throw error;
	} finally {
		wallet.setLoading(false);
	}
}

export async function getWalletAddress(): Promise<string | null> {
	const web3auth = web3authInstance;
	if (!web3auth) {
		return null;
	}

	try {
		const provider = web3auth.provider;
		if (!provider) {
			return null;
		}

		const walletClient = createWalletClient({
			chain: polygonAmoy,
			transport: custom(provider)
		});

		const [address] = await walletClient.getAddresses();
		return address ? getAddress(address) : null;
	} catch {
		return null;
	}
}

