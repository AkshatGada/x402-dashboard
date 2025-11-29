// Network types - Polygon only
export type Network = "polygon" | "polygon-amoy";

export const NETWORKS: Record<Network, { name: string; chainId: number; isTestnet: boolean }> = {
  "polygon": {
    name: "Polygon",
    chainId: 137,
    isTestnet: false
  },
  "polygon-amoy": {
    name: "Polygon Amoy Testnet",
    chainId: 80002,
    isTestnet: true
  }
};

export const DEFAULT_NETWORK: Network = "polygon-amoy";

