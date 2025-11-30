import type { Network } from "./network";

// Price can be a dollar string like "$0.01" or a token amount object
export type Price = string | ERC20TokenAmount;

export interface ERC20TokenAmount {
  amount: string; // Atomic amount (e.g., "1000000" for 1 USDC)
  asset: {
    address: string; // Token contract address
    decimals: number; // Token decimals
    name?: string;
    symbol?: string;
  };
}

// Route configuration for a single API endpoint
export interface RouteConfig {
  path: string;
  price: Price;
  network: Network;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description?: string;
}

// Configuration for multiple routes
export type RoutesConfig = Record<string, RouteConfig>;


