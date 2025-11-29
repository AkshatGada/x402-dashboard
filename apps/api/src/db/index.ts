import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

// Create SQLite database
const sqlite = new Database("x402-dashboard.db");

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Initialize database (create tables if they don't exist)
export function initDatabase() {
  // Tables will be created via drizzle-kit push
  console.log("✅ Database initialized");
}

