import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

// Sellers table
export const sellers = sqliteTable("sellers", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id").notNull().unique(),
  payTo: text("pay_to").notNull(),
  email: text("email"),
  enabled: integer("enabled", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Routes table
export const routes = sqliteTable("routes", {
  id: text("id").primaryKey(),
  sellerId: text("seller_id")
    .notNull()
    .references(() => sellers.id, { onDelete: "cascade" }),
  path: text("path").notNull(),
  price: text("price").notNull(), // Stored as JSON string
  network: text("network").notNull(),
  method: text("method").notNull().default("GET"),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Relations
export const sellersRelations = relations(sellers, ({ many }) => ({
  routes: many(routes),
}));

export const routesRelations = relations(routes, ({ one }) => ({
  seller: one(sellers, {
    fields: [routes.sellerId],
    references: [sellers.id],
  }),
}));

export type Seller = typeof sellers.$inferSelect;
export type InsertSeller = typeof sellers.$inferInsert;
export type Route = typeof routes.$inferSelect;
export type InsertRoute = typeof routes.$inferInsert;

