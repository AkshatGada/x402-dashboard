import type { RouteConfig } from "./routes";

// Seller database model
export interface Seller {
  id: string;
  sellerId: string; // Unique seller identifier
  payTo: string; // Ethereum address to receive payments
  email?: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Seller with routes included
export interface SellerWithRoutes extends Seller {
  routes: RouteConfig[];
}

// Create seller request
export interface CreateSellerRequest {
  sellerId: string;
  payTo: string;
  email?: string;
  routes: RouteConfig[];
}

// Update seller request
export interface UpdateSellerRequest {
  sellerId?: string;
  payTo?: string;
  email?: string;
  enabled?: boolean;
  routes?: RouteConfig[];
}


