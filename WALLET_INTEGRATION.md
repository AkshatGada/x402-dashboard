# MetaMask Embedded Wallet Integration

## Overview

Successfully integrated MetaMask Embedded Wallet (via Web3Auth) into the x402 Dashboard, allowing sellers to connect their wallets directly in the dashboard and automatically fill their payment address.

## What Was Implemented

### 1. Dependencies Installed
- `@web3auth/modal` - Web3Auth Modal SDK for wallet authentication
- `viem` - TypeScript Ethereum library for wallet interactions
- `buffer` & `process` - Polyfills for Node.js dependencies in browser

### 2. Wallet Store (`src/lib/stores/wallet.ts`)
- Svelte store for managing wallet state
- Tracks connection status, address, and error states
- Persists wallet address to localStorage
- Provides reactive state updates

### 3. Web3Auth Integration (`src/lib/wallet/web3auth.ts`)
- Initializes Web3Auth with Polygon network configuration
- Handles wallet connection/disconnection
- Creates viem wallet client for Ethereum interactions
- Supports both Polygon mainnet and Polygon Amoy testnet
- Auto-detects connected network

### 4. Wallet Button Component (`src/lib/components/WalletButton.svelte`)
- Beautiful UI component for wallet connection
- Shows connected address with formatting (0x1234...5678)
- Dropdown menu with disconnect option
- Loading states and error handling
- Smooth animations and transitions

### 5. Dashboard Integration
- Wallet button added to header (next to theme toggle)
- Auto-fills payment address when wallet connects
- "Use Connected" button to manually fill address
- Visual indicator when using connected wallet
- Disabled input when wallet is connected

### 6. Configuration
- Vite config updated with polyfills for Buffer and process
- Environment variable support for Web3Auth Client ID
- Layout component initializes polyfills on mount
- Proper error handling for missing configuration

## Setup Required

### 1. Get Web3Auth Client ID

1. Visit [Web3Auth Dashboard](https://dashboard.web3auth.io/)
2. Create a new project or select existing
3. Copy your Client ID

### 2. Configure Environment

Create `apps/web/.env` file:

```bash
VITE_WEB3AUTH_CLIENT_ID=your_client_id_here
```

### 3. Restart Development Server

```bash
bun run dev
```

## How It Works

### Connection Flow

1. User clicks "Connect Wallet" button
2. Web3Auth modal opens with authentication options
3. User authenticates (social login, email, etc.)
4. Wallet address is retrieved and stored
5. Payment address field auto-fills
6. User can now convert APIs with their wallet address

### Disconnection Flow

1. User clicks wallet address dropdown
2. Clicks "Disconnect" button
3. Web3Auth session cleared
4. Wallet state reset
5. Payment address field cleared

## Features

✅ **Social Login Support** - Users can connect via Google, Twitter, Discord, etc.
✅ **Email Authentication** - Traditional email/password login
✅ **External Wallet** - Connect existing MetaMask or other wallets
✅ **Auto-fill Address** - Payment address automatically populated
✅ **Network Detection** - Automatically detects Polygon network
✅ **Persistent Sessions** - Wallet stays connected across page refreshes
✅ **Error Handling** - Clear error messages for connection issues
✅ **Loading States** - Visual feedback during connection process

## Network Configuration

The wallet is configured for Polygon networks:

- **Polygon Amoy (Testnet)**: Default for development
  - Chain ID: 80002 (0x13882)
  - RPC: https://rpc-amoy.polygon.technology
  - Explorer: https://amoy.polygonscan.com

- **Polygon (Mainnet)**: For production
  - Chain ID: 137 (0x89)
  - Auto-detected when user switches networks

## Code Examples

### Using Wallet Store

```typescript
import { wallet } from '$lib/stores/wallet';

// Check if connected
if ($wallet.isConnected) {
  console.log('Address:', $wallet.address);
}

// Access wallet client
if ($wallet.walletClient) {
  // Use viem wallet client for transactions
}
```

### Connecting Wallet Programmatically

```typescript
import { connectWallet } from '$lib/wallet/web3auth';

try {
  const address = await connectWallet();
  console.log('Connected:', address);
} catch (error) {
  console.error('Connection failed:', error);
}
```

## Troubleshooting

### "VITE_WEB3AUTH_CLIENT_ID is not set"
- Create `.env` file in `apps/web/` directory
- Add your Web3Auth Client ID
- Restart the development server

### "Buffer is not defined"
- Polyfills should load automatically
- Check browser console for errors
- Ensure `buffer` and `process` packages are installed

### Wallet Not Connecting
- Check Web3Auth Dashboard for project status
- Verify Client ID is correct
- Check browser console for detailed errors
- Ensure you're using HTTPS or localhost

## Files Modified/Created

### New Files
- `apps/web/src/lib/stores/wallet.ts` - Wallet state store
- `apps/web/src/lib/wallet/web3auth.ts` - Web3Auth integration
- `apps/web/src/lib/components/WalletButton.svelte` - UI component
- `apps/web/ENV_SETUP.md` - Environment setup guide

### Modified Files
- `apps/web/src/routes/+page.svelte` - Added wallet button and auto-fill
- `apps/web/src/routes/+layout.svelte` - Initialize polyfills
- `apps/web/vite.config.ts` - Added polyfill configuration
- `apps/web/package.json` - Added dependencies
- `README.md` - Updated with wallet integration info

## Next Steps (Optional Enhancements)

- [ ] Add wallet balance display
- [ ] Show network switching UI
- [ ] Add transaction history
- [ ] Support for multiple wallets
- [ ] Wallet QR code display
- [ ] Export wallet functionality
- [ ] Multi-chain support beyond Polygon

## Resources

- [Web3Auth Documentation](https://docs.metamask.io/embedded-wallets/)
- [Viem Documentation](https://viem.sh/)
- [Polygon Network Docs](https://docs.polygon.technology/)

---

**Integration Complete!** 🎉

The dashboard now supports seamless wallet connectivity, making it even easier for sellers to monetize their APIs with x402 on Polygon.

