import { Database } from "bun:sqlite";

const db = new Database("x402-dashboard.db");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sellers (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL UNIQUE,
    pay_to TEXT NOT NULL,
    email TEXT,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  
  CREATE TABLE IF NOT EXISTS routes (
    id TEXT PRIMARY KEY,
    seller_id TEXT NOT NULL,
    path TEXT NOT NULL,
    price TEXT NOT NULL,
    network TEXT NOT NULL,
    method TEXT NOT NULL DEFAULT 'GET',
    description TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE
  );
  
  CREATE INDEX IF NOT EXISTS idx_routes_seller_id ON routes(seller_id);
`);

console.log("✅ Database tables created successfully!");
db.close();

