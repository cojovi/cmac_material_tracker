import { pgTable, text, serial, decimal, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication and role management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("standard"), // 'admin' or 'standard'
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Materials table - core entity
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(), // DFW, ATX, HOU, OKC, ATL, ARK, NSH
  manufacturer: text("manufacturer").notNull(), // Atlas, Malarky, Tri-Built, etc.
  productCategory: text("product_category").notNull(), // Shingle, Accessory, etc.
  distributor: text("distributor").notNull(), // ABCSupply, Beacon, etc.
  tickerSymbol: text("ticker_symbol").notNull(), // ABC, QXO, SRS, CDH, OTH
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  previousPrice: decimal("previous_price", { precision: 10, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  updatedBy: integer("updated_by").references(() => users.id),
});

// Price history for tracking changes over time
export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").references(() => materials.id).notNull(),
  oldPrice: decimal("old_price", { precision: 10, scale: 2 }),
  newPrice: decimal("new_price", { precision: 10, scale: 2 }).notNull(),
  changePercent: decimal("change_percent", { precision: 5, scale: 2 }),
  submittedBy: integer("submitted_by").references(() => users.id).notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  notes: text("notes"),
});

// Price change requests for standard users
export const priceChangeRequests = pgTable("price_change_requests", {
  id: serial("id").primaryKey(),
  materialName: text("material_name").notNull(),
  distributor: text("distributor").notNull(),
  requestedPrice: decimal("requested_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  submittedBy: integer("submitted_by").references(() => users.id).notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"),
  slackMessageTs: text("slack_message_ts"), // Slack message timestamp for tracking
});

// Location options enum
export const LOCATIONS = ["DFW", "ATX", "HOU", "OKC", "ATL", "ARK", "NSH"] as const;

// Manufacturer options enum
export const MANUFACTURERS = [
  "Atlas", "Malarky", "Tri-Built", "CertainTeed", "Tamko", 
  "GAF", "Owens Corning", "IKO", "Other"
] as const;

// Product category options enum
export const PRODUCT_CATEGORIES = [
  "Shingle", "Accessory", "Decking", "Underlayment", 
  "Ventilation", "Flashing", "Garage Door", "Door Motor", "Other"
] as const;

// Distributor options enum with ticker mapping
export const DISTRIBUTORS = {
  "ABCSupply": "ABC",
  "Beacon": "QXO", 
  "SRSProducts": "SRS",
  "CommercialDistributors": "CDH",
  "Other": "OTH"
} as const;

export const DISTRIBUTOR_NAMES = Object.keys(DISTRIBUTORS) as [keyof typeof DISTRIBUTORS, ...(keyof typeof DISTRIBUTORS)[]];

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  lastUpdated: true,
  updatedBy: true,
  previousPrice: true,
}).extend({
  location: z.enum(LOCATIONS),
  manufacturer: z.enum(MANUFACTURERS),
  productCategory: z.enum(PRODUCT_CATEGORIES),
  distributor: z.enum(DISTRIBUTOR_NAMES),
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
  submittedAt: true,
  approvedAt: true,
});

export const insertPriceChangeRequestSchema = createInsertSchema(priceChangeRequests).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
  slackMessageTs: true,
}).extend({
  distributor: z.enum(DISTRIBUTOR_NAMES),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type PriceHistory = typeof priceHistory.$inferSelect;
export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;
export type PriceChangeRequest = typeof priceChangeRequests.$inferSelect;
export type InsertPriceChangeRequest = z.infer<typeof insertPriceChangeRequestSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

// Extended types for API responses
export type MaterialWithHistory = Material & {
  recentHistory?: PriceHistory[];
  changePercent?: number;
  changeDirection?: 'up' | 'down' | 'new';
};

export type DashboardStats = {
  totalMaterials: number;
  avgPriceChange: number;
  recentUpdates: number;
  pendingRequests: number;
};

export type LocationPerformance = {
  location: string;
  changePercent: number;
  materialCount: number;
};

export type DistributorPerformance = {
  distributor: string;
  tickerSymbol: string;
  changePercent: number;
  materialCount: number;
};
