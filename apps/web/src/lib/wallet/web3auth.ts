import { browser } from '$app/environment';
import { wallet } from './wallet';

// Dynamic imports for browser-only code
let Web3Auth: any;
let WEB3AUTH_NETWORK: any;
let createWalletClient: any;
let custom: any;
let getAddress: any;
let polygon: any;
let polygonAmoy: any;

if (browser) {
	// Only import these in browser
	import('@web3auth/modal').then((mod) => {
		Web3Auth = mod.Web3Auth;
		WEB3AUTH_NETWORK = mod.WEB3AUTH_NETWORK;
	});
	import('viem').then((mod) => {
		createWalletClient = mod.createWalletClient;
		custom = mod.custom;
		getAddress = mod.getAddress;
	});
	import('viem/chains').then((mod) => {
		polygon = mod.polygon;
		polygonAmoy = mod.polygonAmoy;
	});
}

// Get Web3Auth Client ID from environment
const WEB3AUTH_CLIENT_ID = import.meta.env.VITE_WEB3AUTH_CLIENT_ID || '';

// Initialize Web3Auth instance
let web3authInstance: Web3Auth | null = null;

export async function initWeb3Auth(): Promise<any> {
	if (!browser) {
		throw new Error('Web3Auth can only be initialized in browser');
	}

	if (web3authInstance) {
		return web3authInstance;
	}

	if (!WEB3AUTH_CLIENT_ID) {
		throw new Error('VITE_WEB3AUTH_CLIENT_ID is not set in environment variables. Please create a .env file with your Web3Auth Client ID.');
	}

	// Dynamically import modules
	const web3AuthModule = await import('@web3auth/modal');
	const Web3AuthClass = web3AuthModule.Web3Auth;
	const WEB3AUTH_NETWORK_ENUM = web3AuthModule.WEB3AUTH_NETWORK;

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

	const web3auth = new Web3AuthClass({
		clientId: WEB3AUTH_CLIENT_ID,
		web3AuthNetwork: WEB3AUTH_NETWORK_ENUM.SAPPHIRE_DEVNET, // Use DEVNET for development
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
	if (!browser) {
		throw new Error('Wallet can only be connected in browser');
	}

	try {
		wallet.setLoading(true);
		wallet.setError(null);

		const web3auth = await initWeb3Auth();

		// Connect to Web3Auth
		const web3authProvider = await web3auth.connect();

		if (!web3authProvider) {
			throw new Error('Failed to connect to Web3Auth');
		}

		// Dynamically import viem
		const viemModule = await import('viem');
		const chainsModule = await import('viem/chains');
		const createWalletClientFn = viemModule.createWalletClient;
		const customTransport = viemModule.custom;
		const getAddressFn = viemModule.getAddress;

		// Get the chain ID to determine which network
		const chainId = await web3authProvider.request({ method: 'eth_chainId' });
		const selectedChain = chainId === '0x89' ? chainsModule.polygon : chainsModule.polygonAmoy; // 0x89 = Polygon mainnet

		// Create wallet client with viem
		const walletClient = createWalletClientFn({
			chain: selectedChain,
			transport: customTransport(web3authProvider)
		});

		// Get connected accounts
		const [address] = await walletClient.getAddresses();
		const normalizedAddress = getAddressFn(address);

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
	if (!browser) {
		return null;
	}

	const web3auth = web3authInstance;
	if (!web3auth) {
		return null;
	}

	try {
		const provider = web3auth.provider;
		if (!provider) {
			return null;
		}

		const viemModule = await import('viem');
		const chainsModule = await import('viem/chains');
		const walletClient = viemModule.createWalletClient({
			chain: chainsModule.polygonAmoy,
			transport: viemModule.custom(provider)
		});

		const [address] = await walletClient.getAddresses();
		return address ? viemModule.getAddress(address) : null;
	} catch {
		return null;
	}
}

