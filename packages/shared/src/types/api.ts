import type { RouteConfig } from "./routes";
import type { Network } from "./network";

// API conversion request
export interface ConvertAPIRequest {
  apiUrl: string;
  price: string;
  network: Network;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description?: string;
  payTo: string;
}

// API conversion response with generated code
export interface ConvertAPIResponse {
  success: boolean;
  route: RouteConfig;
  generatedCode: {
    express: string;
    elysia: string;
    config: string;
  };
  error?: string;
}

// Generic API response wrapper
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}


