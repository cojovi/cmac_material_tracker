import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { storage } from "./storage";
import { 
  insertMaterialSchema, insertPriceChangeRequestSchema, loginSchema,
  type User, type Material, type PriceChangeRequest 
} from "@shared/schema";
import { 
  sendPriceChangeRequestNotification, 
  sendPriceChangeApprovalNotification,
  sendAdminPriceUpdateNotification 
} from "./services/slack";
import { z } from "zod";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: string;
      name: string;
    }
  }
}

// Passport configuration
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await storage.validatePassword(email, password);
      if (user) {
        return done(null, user);
      }
      return done(null, false, { message: 'Invalid credentials' });
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUserById(id);
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated
const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
};

// Middleware to check if user is admin
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Admin access required' });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Multer configuration for file uploads
  const upload = multer({ storage: multer.memoryStorage() });

  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Auth routes
  app.post('/api/auth/login', (req, res, next) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid input', errors: validation.error.errors });
    }

    passport.authenticate('local', (err: any, user: User | false, info: any) => {
      if (err) {
        return res.status(500).json({ message: 'Authentication error' });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Invalid credentials' });
      }
      
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login error' });
        }
        res.json({ 
          user: { 
            id: user.id, 
            email: user.email, 
            role: user.role, 
            name: user.name 
          } 
        });
      });
    })(req, res, next);
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout error' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ 
      user: { 
        id: req.user!.id, 
        email: req.user!.email, 
        role: req.user!.role, 
        name: req.user!.name 
      } 
    });
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', requireAuth, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Failed to fetch dashboard stats' });
    }
  });

  app.get('/api/dashboard/location-performance', requireAuth, async (req, res) => {
    try {
      const performance = await storage.getLocationPerformance();
      res.json(performance);
    } catch (error) {
      console.error('Error fetching location performance:', error);
      res.status(500).json({ message: 'Failed to fetch location performance' });
    }
  });

  app.get('/api/dashboard/distributor-performance', requireAuth, async (req, res) => {
    try {
      const performance = await storage.getDistributorPerformance();
      res.json(performance);
    } catch (error) {
      console.error('Error fetching distributor performance:', error);
      res.status(500).json({ message: 'Failed to fetch distributor performance' });
    }
  });

  // Materials routes
  app.get('/api/materials', requireAuth, async (req, res) => {
    try {
      const materials = await storage.getAllMaterials();
      res.json(materials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      res.status(500).json({ message: 'Failed to fetch materials' });
    }
  });

  app.get('/api/materials/search', requireAuth, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: 'Search query required' });
      }
      const materials = await storage.searchMaterials(query);
      res.json(materials);
    } catch (error) {
      console.error('Error searching materials:', error);
      res.status(500).json({ message: 'Failed to search materials' });
    }
  });

  app.get('/api/materials/trending', requireAuth, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const materials = await storage.getTrendingMaterials(days);
      res.json(materials);
    } catch (error) {
      console.error('Error fetching trending materials:', error);
      res.status(500).json({ message: 'Failed to fetch trending materials' });
    }
  });

  app.post('/api/materials', requireAdmin, async (req, res) => {
    try {
      const validation = insertMaterialSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid input', errors: validation.error.errors });
      }

      const material = await storage.createMaterial(validation.data, req.user!.id);
      
      // Send Slack notification
      await sendAdminPriceUpdateNotification({
        materialName: material.name,
        distributor: material.distributor,
        location: material.location,
        newPrice: material.currentPrice,
        updatedBy: req.user!.name,
      });

      res.status(201).json(material);
    } catch (error) {
      console.error('Error creating material:', error);
      res.status(500).json({ message: 'Failed to create material' });
    }
  });

  app.patch('/api/materials/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertMaterialSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid input', errors: validation.error.errors });
      }

      const currentMaterial = await storage.getMaterialById(id);
      if (!currentMaterial) {
        return res.status(404).json({ message: 'Material not found' });
      }

      const material = await storage.updateMaterial(id, validation.data, req.user!.id);
      
      // Send Slack notification if price changed
      if (validation.data.currentPrice) {
        await sendAdminPriceUpdateNotification({
          materialName: material.name,
          distributor: material.distributor,
          location: material.location,
          newPrice: material.currentPrice,
          oldPrice: currentMaterial.currentPrice,
          updatedBy: req.user!.name,
        });
      }

      res.json(material);
    } catch (error) {
      console.error('Error updating material:', error);
      res.status(500).json({ message: 'Failed to update material' });
    }
  });

  // Price history routes
  app.get('/api/materials/:id/history', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const days = parseInt(req.query.days as string) || 30;
      const history = await storage.getPriceHistory(id, days);
      res.json(history);
    } catch (error) {
      console.error('Error fetching price history:', error);
      res.status(500).json({ message: 'Failed to fetch price history' });
    }
  });

  app.get('/api/price-changes/recent', requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const changes = await storage.getRecentPriceChanges(limit);
      res.json(changes);
    } catch (error) {
      console.error('Error fetching recent price changes:', error);
      res.status(500).json({ message: 'Failed to fetch recent price changes' });
    }
  });

  // Price change requests
  app.post('/api/price-change-requests', requireAuth, async (req, res) => {
    try {
      const validation = insertPriceChangeRequestSchema.safeParse({
        ...req.body,
        submittedBy: req.user!.id,
      });
      
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid input', errors: validation.error.errors });
      }

      const request = await storage.createPriceChangeRequest(validation.data);
      
      // Send Slack notification
      const messageTs = await sendPriceChangeRequestNotification({
        id: request.id,
        materialName: request.materialName,
        distributor: request.distributor,
        requestedPrice: request.requestedPrice,
        currentPrice: request.currentPrice || undefined,
        submittedBy: req.user!.name,
      });

      // Update request with Slack message timestamp
      if (messageTs) {
        await storage.updatePriceChangeRequest(request.id, { slackMessageTs: messageTs });
      }

      res.status(201).json(request);
    } catch (error) {
      console.error('Error creating price change request:', error);
      res.status(500).json({ message: 'Failed to create price change request' });
    }
  });

  app.get('/api/price-change-requests', requireAuth, async (req, res) => {
    try {
      const status = req.query.status as string;
      const requests = await storage.getPriceChangeRequests(status);
      res.json(requests);
    } catch (error) {
      console.error('Error fetching price change requests:', error);
      res.status(500).json({ message: 'Failed to fetch price change requests' });
    }
  });

  app.patch('/api/price-change-requests/:id/approve', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.updatePriceChangeRequest(id, {
        status: 'approved',
        reviewedBy: req.user!.id,
        reviewedAt: new Date(),
      });

      // Send approval notification
      await sendPriceChangeApprovalNotification({
        materialName: request.materialName,
        distributor: request.distributor,
        newPrice: request.requestedPrice,
        oldPrice: request.currentPrice || undefined,
        approvedBy: req.user!.name,
      });

      res.json(request);
    } catch (error) {
      console.error('Error approving price change request:', error);
      res.status(500).json({ message: 'Failed to approve price change request' });
    }
  });

  app.patch('/api/price-change-requests/:id/reject', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { notes } = req.body;
      
      const request = await storage.updatePriceChangeRequest(id, {
        status: 'rejected',
        reviewedBy: req.user!.id,
        reviewedAt: new Date(),
        notes,
      });

      res.json(request);
    } catch (error) {
      console.error('Error rejecting price change request:', error);
      res.status(500).json({ message: 'Failed to reject price change request' });
    }
  });

  // CSV Upload route
  app.post("/api/materials/bulk-upload", requireAdmin, upload.single('csv'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file provided" });
      }

      const csvContent = req.file.buffer.toString('utf-8');
      
      // Parse CSV
      let records;
      try {
        records = parse(csvContent, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        });
      } catch (parseError) {
        return res.status(400).json({ error: "Invalid CSV format" });
      }

      const results = {
        success: 0,
        errors: [] as { row: number; error: string }[],
        total: records.length,
      };

      // Process each record
      for (let i = 0; i < records.length; i++) {
        const record = records[i] as any;
        const rowNumber = i + 2; // +2 because CSV has header row and arrays are 0-indexed

        try {
          // Validate required fields
          const materialData = {
            name: record.name?.trim(),
            location: record.location?.trim(),
            manufacturer: record.manufacturer?.trim(),
            productCategory: record.productCategory?.trim(),
            distributor: record.distributor?.trim(),
            currentPrice: record.currentPrice?.toString().trim(),
          };

          // Validate using Zod schema
          const validatedData = insertMaterialSchema.parse(materialData);
          
          // Create material
          await storage.createMaterial(validatedData, req.user!.id);
          results.success++;
          
        } catch (error) {
          let errorMessage = "Unknown error";
          
          if (error instanceof z.ZodError) {
            errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          
          results.errors.push({
            row: rowNumber,
            error: errorMessage,
          });
        }
      }

      res.json(results);
      
    } catch (error) {
      console.error("CSV upload error:", error);
      res.status(500).json({ error: "Internal server error during CSV upload" });
    }
  });

  // Price history endpoint for the new page
  app.get('/api/price-history/all', requireAuth, async (req, res) => {
    try {
      // Get all price history with material details
      const allHistory = await storage.getRecentPriceChanges(100); // Get more records
      res.json(allHistory);
    } catch (error) {
      console.error('Error fetching price history:', error);
      res.status(500).json({ message: 'Failed to fetch price history' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
