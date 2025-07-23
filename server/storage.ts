import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, sql, and, gte, count, avg } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  users, materials, priceHistory, priceChangeRequests,
  type User, type InsertUser, type Material, type InsertMaterial,
  type PriceHistory, type InsertPriceHistory, type PriceChangeRequest,
  type InsertPriceChangeRequest, type MaterialWithHistory, type DashboardStats,
  type LocationPerformance, type DistributorPerformance, DISTRIBUTORS
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable must be set");
}

const sql_client = neon(process.env.DATABASE_URL);
const db = drizzle(sql_client);

export interface IStorage {
  // User management
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validatePassword(email: string, password: string): Promise<User | null>;

  // Material management
  getAllMaterials(): Promise<MaterialWithHistory[]>;
  getMaterialById(id: number): Promise<Material | undefined>;
  createMaterial(material: InsertMaterial, userId: number): Promise<Material>;
  updateMaterial(id: number, material: Partial<InsertMaterial>, userId: number): Promise<Material>;
  deleteMaterial(id: number): Promise<boolean>;
  searchMaterials(query: string): Promise<Material[]>;

  // Price history
  getPriceHistory(materialId: number, days?: number): Promise<PriceHistory[]>;
  addPriceHistory(history: InsertPriceHistory): Promise<PriceHistory>;
  getRecentPriceChanges(limit?: number): Promise<(PriceHistory & { material: Material })[]>;

  // Price change requests
  createPriceChangeRequest(request: InsertPriceChangeRequest): Promise<PriceChangeRequest>;
  getPriceChangeRequests(status?: string): Promise<(PriceChangeRequest & { submittedUser: User })[]>;
  updatePriceChangeRequest(id: number, updates: Partial<PriceChangeRequest>): Promise<PriceChangeRequest>;

  // Dashboard analytics
  getDashboardStats(): Promise<DashboardStats>;
  getLocationPerformance(): Promise<LocationPerformance[]>;
  getDistributorPerformance(): Promise<DistributorPerformance[]>;
  getTrendingMaterials(days?: number): Promise<MaterialWithHistory[]>;
}

export class DatabaseStorage implements IStorage {
  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const result = await db.insert(users).values({
      ...user,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getAllMaterials(): Promise<MaterialWithHistory[]> {
    const materialsWithHistory = await db
      .select({
        id: materials.id,
        name: materials.name,
        location: materials.location,
        manufacturer: materials.manufacturer,
        productCategory: materials.productCategory,
        distributor: materials.distributor,
        tickerSymbol: materials.tickerSymbol,
        currentPrice: materials.currentPrice,
        previousPrice: materials.previousPrice,
        lastUpdated: materials.lastUpdated,
        updatedBy: materials.updatedBy,
      })
      .from(materials)
      .orderBy(desc(materials.lastUpdated));

    // Calculate change percentages
    return materialsWithHistory.map(material => {
      let changePercent = 0;
      let changeDirection: 'up' | 'down' | 'new' = 'new';

      if (material.previousPrice && material.previousPrice !== '0') {
        const current = parseFloat(material.currentPrice);
        const previous = parseFloat(material.previousPrice);
        changePercent = ((current - previous) / previous) * 100;
        changeDirection = changePercent > 0 ? 'up' : 'down';
      }

      return {
        ...material,
        changePercent,
        changeDirection,
      };
    });
  }

  async getMaterialById(id: number): Promise<Material | undefined> {
    const result = await db.select().from(materials).where(eq(materials.id, id)).limit(1);
    return result[0];
  }

  async createMaterial(material: InsertMaterial, userId: number): Promise<Material> {
    const tickerSymbol = DISTRIBUTORS[material.distributor];
    const result = await db.insert(materials).values({
      ...material,
      tickerSymbol,
      updatedBy: userId,
    }).returning();
    return result[0];
  }

  async updateMaterial(id: number, materialData: Partial<InsertMaterial>, userId: number): Promise<Material> {
    // Get current material for price history
    const currentMaterial = await this.getMaterialById(id);
    if (!currentMaterial) {
      throw new Error("Material not found");
    }

    const updates: any = { ...materialData, updatedBy: userId };
    
    // Update ticker symbol if distributor changed
    if (materialData.distributor) {
      updates.tickerSymbol = DISTRIBUTORS[materialData.distributor];
    }

    // If price is being updated, store previous price
    if (materialData.currentPrice) {
      updates.previousPrice = currentMaterial.currentPrice;
      
      // Add to price history
      await this.addPriceHistory({
        materialId: id,
        oldPrice: currentMaterial.currentPrice,
        newPrice: materialData.currentPrice,
        submittedBy: userId,
        status: 'approved',
      });
    }

    const result = await db.update(materials)
      .set(updates)
      .where(eq(materials.id, id))
      .returning();
    
    return result[0];
  }

  async deleteMaterial(id: number): Promise<boolean> {
    const result = await db.delete(materials).where(eq(materials.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async searchMaterials(query: string): Promise<Material[]> {
    const result = await db
      .select()
      .from(materials)
      .where(sql`${materials.name} ILIKE ${`%${query}%`}`)
      .limit(10);
    return result;
  }

  async getPriceHistory(materialId: number, days: number = 30): Promise<PriceHistory[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await db
      .select()
      .from(priceHistory)
      .where(
        and(
          eq(priceHistory.materialId, materialId),
          gte(priceHistory.submittedAt, cutoffDate)
        )
      )
      .orderBy(desc(priceHistory.submittedAt));
    
    return result;
  }

  async addPriceHistory(history: InsertPriceHistory): Promise<PriceHistory> {
    // Calculate change percentage
    const changePercent = history.oldPrice && history.oldPrice !== '0' 
      ? ((parseFloat(history.newPrice) - parseFloat(history.oldPrice)) / parseFloat(history.oldPrice)) * 100
      : 0;

    const result = await db.insert(priceHistory).values({
      ...history,
      changePercent: changePercent.toString(),
    }).returning();
    
    return result[0];
  }

  async getRecentPriceChanges(limit: number = 5): Promise<(PriceHistory & { material: Material })[]> {
    const result = await db
      .select({
        id: priceHistory.id,
        materialId: priceHistory.materialId,
        oldPrice: priceHistory.oldPrice,
        newPrice: priceHistory.newPrice,
        changePercent: priceHistory.changePercent,
        submittedBy: priceHistory.submittedBy,
        submittedAt: priceHistory.submittedAt,
        approvedBy: priceHistory.approvedBy,
        approvedAt: priceHistory.approvedAt,
        status: priceHistory.status,
        notes: priceHistory.notes,
        material: materials,
      })
      .from(priceHistory)
      .innerJoin(materials, eq(priceHistory.materialId, materials.id))
      .where(eq(priceHistory.status, 'approved'))
      .orderBy(desc(priceHistory.submittedAt))
      .limit(limit);

    return result;
  }

  async createPriceChangeRequest(request: InsertPriceChangeRequest): Promise<PriceChangeRequest> {
    const result = await db.insert(priceChangeRequests).values(request).returning();
    return result[0];
  }

  async getPriceChangeRequests(status?: string): Promise<(PriceChangeRequest & { submittedUser: User })[]> {
    let query = db
      .select({
        id: priceChangeRequests.id,
        materialName: priceChangeRequests.materialName,
        distributor: priceChangeRequests.distributor,
        requestedPrice: priceChangeRequests.requestedPrice,
        currentPrice: priceChangeRequests.currentPrice,
        submittedBy: priceChangeRequests.submittedBy,
        submittedAt: priceChangeRequests.submittedAt,
        status: priceChangeRequests.status,
        reviewedBy: priceChangeRequests.reviewedBy,
        reviewedAt: priceChangeRequests.reviewedAt,
        notes: priceChangeRequests.notes,
        slackMessageTs: priceChangeRequests.slackMessageTs,
        submittedUser: users,
      })
      .from(priceChangeRequests)
      .innerJoin(users, eq(priceChangeRequests.submittedBy, users.id));

    if (status) {
      query = query.where(eq(priceChangeRequests.status, status));
    }

    return await query.orderBy(desc(priceChangeRequests.submittedAt));
  }

  async updatePriceChangeRequest(id: number, updates: Partial<PriceChangeRequest>): Promise<PriceChangeRequest> {
    const result = await db
      .update(priceChangeRequests)
      .set(updates)
      .where(eq(priceChangeRequests.id, id))
      .returning();
    
    return result[0];
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const [totalMaterials] = await db.select({ count: count() }).from(materials);
    
    const [pendingRequests] = await db
      .select({ count: count() })
      .from(priceChangeRequests)
      .where(eq(priceChangeRequests.status, 'pending'));

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const [recentUpdates] = await db
      .select({ count: count() })
      .from(priceHistory)
      .where(gte(priceHistory.submittedAt, twentyFourHoursAgo));

    // Calculate average price change
    const avgChangeResult = await db
      .select({ avg: avg(sql`CAST(${priceHistory.changePercent} AS DECIMAL)`) })
      .from(priceHistory)
      .where(gte(priceHistory.submittedAt, twentyFourHoursAgo));

    return {
      totalMaterials: totalMaterials.count,
      avgPriceChange: parseFloat(avgChangeResult[0].avg || '0'),
      recentUpdates: recentUpdates.count,
      pendingRequests: pendingRequests.count,
    };
  }

  async getLocationPerformance(): Promise<LocationPerformance[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await db
      .select({
        location: materials.location,
        materialCount: count(materials.id),
        avgChange: avg(sql`CAST(${priceHistory.changePercent} AS DECIMAL)`),
      })
      .from(materials)
      .leftJoin(priceHistory, eq(materials.id, priceHistory.materialId))
      .where(gte(priceHistory.submittedAt, thirtyDaysAgo))
      .groupBy(materials.location);

    return result.map(row => ({
      location: row.location,
      changePercent: parseFloat(row.avgChange || '0'),
      materialCount: row.materialCount,
    }));
  }

  async getDistributorPerformance(): Promise<DistributorPerformance[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await db
      .select({
        distributor: materials.distributor,
        tickerSymbol: materials.tickerSymbol,
        materialCount: count(materials.id),
        avgChange: avg(sql`CAST(${priceHistory.changePercent} AS DECIMAL)`),
      })
      .from(materials)
      .leftJoin(priceHistory, eq(materials.id, priceHistory.materialId))
      .where(gte(priceHistory.submittedAt, thirtyDaysAgo))
      .groupBy(materials.distributor, materials.tickerSymbol);

    return result.map(row => ({
      distributor: row.distributor,
      tickerSymbol: row.tickerSymbol,
      changePercent: parseFloat(row.avgChange || '0'),
      materialCount: row.materialCount,
    }));
  }

  async getTrendingMaterials(days: number = 7): Promise<MaterialWithHistory[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const trendingMaterials = await db
      .select({
        material: materials,
        recentChange: priceHistory.changePercent,
      })
      .from(materials)
      .innerJoin(priceHistory, eq(materials.id, priceHistory.materialId))
      .where(gte(priceHistory.submittedAt, cutoffDate))
      .orderBy(desc(sql`ABS(CAST(${priceHistory.changePercent} AS DECIMAL))`))
      .limit(10);

    return trendingMaterials.map(row => ({
      ...row.material,
      changePercent: parseFloat(row.recentChange || '0'),
      changeDirection: parseFloat(row.recentChange || '0') > 0 ? 'up' as const : 'down' as const,
    }));
  }
}

export const storage = new DatabaseStorage();
