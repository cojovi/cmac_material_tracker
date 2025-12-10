import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { storage } from "./storage";
import { supabaseAdmin } from "./supabase";
import {
  insertMaterialSchema, insertPriceChangeRequestSchema, loginSchema,
  type User, type Material, type PriceChangeRequest
} from "@shared/schema";
import {
  sendPriceChangeRequestNotification,
  sendPriceChangeApprovalNotification,
  sendAdminPriceUpdateNotification
} from "./services/slack";
import { WebClient } from "@slack/web-api";
import { z } from "zod";

// Helper function to calculate percentage change
function calculatePercentageChange(oldPrice: number, newPrice: number): number {
  if (oldPrice === 0) return 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
}

declare global {
  namespace Express {
    interface User {
      id: string; // Changed from number to string (UUID)
      email: string;
      role: string;
      name: string;
    }
    interface Request {
      supabaseAccessToken?: string;
    }
  }
}

// Middleware to extract and verify Supabase user from JWT
const extractSupabaseUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // No token, continue without user (some routes don't require auth)
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    req.supabaseAccessToken = token;

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.error('Token verification failed:', error?.message);
      return next(); // Invalid token, continue without user
    }

    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch failed:', profileError?.message);
      return next(); // Profile not found, continue without user
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email!,
      role: profile.role,
      name: profile.name,
    };

    next();
  } catch (error) {
    console.error('Error in extractSupabaseUser middleware:', error);
    next(); // Continue without user on error
  }
};

// Middleware to check if user is authenticated
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
};

// Middleware to check if user is admin
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Admin access required' });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Multer configuration for file uploads
  const upload = multer({ storage: multer.memoryStorage() });

  // Apply Supabase user extraction middleware globally
  app.use(extractSupabaseUser);

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: 'Invalid input', errors: validation.error.errors });
    }

    try {
      const { email, password } = validation.data;

      // Sign in with Supabase
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user || !data.session) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('role, name')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        return res.status(500).json({ message: 'Failed to fetch user profile' });
      }

      res.json({
        user: {
          id: data.user.id,
          email: data.user.email!,
          role: profile.role,
          name: profile.name,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Authentication error' });
    }
  });

  app.post('/api/auth/logout', async (req, res) => {
    try {
      if (req.supabaseAccessToken) {
        await supabaseAdmin.auth.signOut(req.supabaseAccessToken);
      }
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Logout error' });
    }
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

  // Optional: Signup route for creating new users
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, name, role = 'user' } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Email, password, and name are required' });
      }

      // Create user with Supabase Auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (error || !data.user) {
        return res.status(400).json({ message: error?.message || 'Failed to create user' });
      }

      // Create user profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          name,
          role,
        });

      if (profileError) {
        // Rollback user creation if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(data.user.id);
        return res.status(500).json({ message: 'Failed to create user profile' });
      }

      res.status(201).json({
        user: {
          id: data.user.id,
          email: data.user.email!,
          name,
          role,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Signup error' });
    }
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

  // Materials routes - IMPORTANT: Specific routes MUST come before :id pattern
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

  app.get('/api/materials', requireAuth, async (req, res) => {
    try {
      const materials = await storage.getAllMaterials();
      res.json(materials);
    } catch (error) {
      console.error('Error fetching materials:', error);
      res.status(500).json({ message: 'Failed to fetch materials' });
    }
  });

  // Single material by ID - MUST be after specific routes like /search and /trending
  app.get('/api/materials/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid material ID' });
      }
      const material = await storage.getMaterialById(id);
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
      res.json(material);
    } catch (error) {
      console.error('Error fetching material:', error);
      res.status(500).json({ message: 'Failed to fetch material' });
    }
  });

  app.post('/api/materials', requireAdmin, async (req, res) => {
    try {
      const validation = insertMaterialSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid input', errors: validation.error.errors });
      }

      const material = await storage.createMaterial(validation.data, req.user!.id);

      // Send Slack notification (best-effort, don't fail request if Slack fails)
      try {
        await sendAdminPriceUpdateNotification({
          materialName: material.name,
          distributor: material.distributor,
          location: material.location,
          newPrice: material.currentPrice,
          updatedBy: req.user!.name,
        });
      } catch (slackError) {
        console.error('Slack notification failed (non-blocking):', slackError);
      }

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

      // Send Slack notification if price changed (best-effort, don't fail request if Slack fails)
      if (validation.data.currentPrice) {
        try {
          await sendAdminPriceUpdateNotification({
            materialName: material.name,
            distributor: material.distributor,
            location: material.location,
            newPrice: material.currentPrice,
            oldPrice: currentMaterial.currentPrice,
            updatedBy: req.user!.name,
          });
        } catch (slackError) {
          console.error('Slack notification failed (non-blocking):', slackError);
        }
      }

      res.json(material);
    } catch (error) {
      console.error('Error updating material:', error);
      res.status(500).json({ message: 'Failed to update material' });
    }
  });

  // Price history routes - supports both /materialId/timeRange and /materialId?timeRange=timeRange
  app.get('/api/price-history/:materialId/:timeRange?', requireAuth, async (req, res) => {
    try {
      const materialId = parseInt(req.params.materialId);
      if (isNaN(materialId)) {
        return res.status(400).json({ message: 'Invalid material ID' });
      }

      const timeRange = req.params.timeRange || req.query.timeRange as string || '3m';

      // Convert time range to days
      let days = 90; // Default 3 months
      switch (timeRange) {
        case '7d': days = 7; break;
        case '1m': days = 30; break;
        case '3m': days = 90; break;
        case '6m': days = 180; break;
        case '1y': days = 365; break;
      }

      const history = await storage.getPriceHistory(materialId, days);
      res.json(history);
    } catch (error) {
      console.error('Error fetching price history:', error);
      res.status(500).json({ message: 'Failed to fetch price history' });
    }
  });

  app.get('/api/materials/:id/history', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid material ID' });
      }

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

  // Slack interactive components webhook
  app.post('/api/slack/interactive', async (req, res) => {
    console.log('Received Slack interactive request');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    try {
      // Respond immediately to avoid timeout
      res.status(200).send('OK');

      // Check if payload exists
      if (!req.body.payload) {
        console.error('No payload in request body');
        return;
      }

      // Parse the payload from form data
      const payload = JSON.parse(req.body.payload);
      console.log('Parsed payload:', JSON.stringify(payload, null, 2));

      if (payload.type === 'block_actions') {
        const action = payload.actions[0];
        const actionId = action.action_id;
        const value = action.value;

        if (actionId === 'approve_price_change' || actionId === 'reject_price_change') {
          const [actionType, requestId] = value.split('_');
          const status = actionType === 'approve' ? 'approved' : 'rejected';

          // Get an admin user for automated approvals from Slack
          const adminUser = await storage.getUserByEmail('codyv@cmacroofing.com');
          const adminUserId = adminUser?.id;

          if (!adminUserId) {
            console.error('Admin user not found for Slack approval');
            return;
          }

          // Update the request status
          const updatedRequest = await storage.updatePriceChangeRequestStatus(
            parseInt(requestId),
            status,
            payload.user.name // Slack user name for logging
          );

          if (updatedRequest && status === 'approved') {
            // If approved, update the material price
            console.log(`Looking for material: "${updatedRequest.materialName}" with current price: "${updatedRequest.currentPrice}"`);

            // Try to find material by name and current price first (more accurate)
            let material = updatedRequest.currentPrice
              ? await storage.findMaterialByNameAndPrice(updatedRequest.materialName, updatedRequest.currentPrice)
              : null;

            // Fallback to name-only search
            if (!material) {
              material = await storage.getMaterialByName(updatedRequest.materialName);
            }

            console.log('Found material:', material ? `ID: ${material.id}, Name: ${material.name}, Current Price: ${material.currentPrice}` : 'NOT FOUND');

            if (material) {
              console.log(`Updating material ID ${material.id} price from ${material.currentPrice} to ${updatedRequest.requestedPrice}`);

              try {
                await storage.updateMaterialPrice(
                  material.id,
                  parseFloat(updatedRequest.requestedPrice),
                  adminUserId
                );
                console.log(`Successfully updated material price for ${material.name}`);
              } catch (error) {
                console.error(`Failed to update material price:`, error);
              }

              // Send approval notification
              await sendPriceChangeApprovalNotification({
                materialName: updatedRequest.materialName,
                distributor: updatedRequest.distributor,
                newPrice: updatedRequest.requestedPrice,
                oldPrice: updatedRequest.currentPrice || undefined,
                approvedBy: payload.user.name || 'Admin'
              });
            }
          }

          // Send a follow-up message to the channel
          const responseText = status === 'approved'
            ? `Price change approved by ${payload.user.name || 'Admin'}`
            : `Price change rejected by ${payload.user.name || 'Admin'}`;

          // Send follow-up message using Slack API
          if (process.env.SLACK_BOT_TOKEN) {
            const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
            await slack.chat.postMessage({
              channel: process.env.SLACK_CHANNEL_ID || '',
              text: responseText,
              thread_ts: payload.message?.ts // Reply in thread if possible
            });
          }
        } else {
          console.log('Unknown action:', actionId);
        }
      } else {
        console.log('Unsupported payload type:', payload.type);
      }
    } catch (error) {
      console.error('Error handling Slack interaction:', error);
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
        console.error('Price change request validation failed:', validation.error.errors);
        console.error('Request body:', req.body);
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

      // Update the material price when approved manually from dashboard
      console.log(`Manual approval: Looking for material: "${request.materialName}" with current price: "${request.currentPrice}"`);

      // Try to find material by name and current price first (more accurate)
      let material = request.currentPrice
        ? await storage.findMaterialByNameAndPrice(request.materialName, request.currentPrice)
        : null;

      // Fallback to name-only search
      if (!material) {
        material = await storage.getMaterialByName(request.materialName);
      }

      console.log('Manual approval found material:', material ? `ID: ${material.id}, Name: ${material.name}, Current Price: ${material.currentPrice}` : 'NOT FOUND');

      if (material) {
        console.log(`Manual approval: Updating material ID ${material.id} price from ${material.currentPrice} to ${request.requestedPrice}`);

        try {
          await storage.updateMaterialPrice(
            material.id,
            parseFloat(request.requestedPrice),
            req.user!.id
          );
          console.log(`Manual approval: Successfully updated material price for ${material.name}`);
        } catch (error) {
          console.error(`Manual approval: Failed to update material price:`, error);
        }
      } else {
        console.error(`Manual approval: Material not found: "${request.materialName}"`);
      }

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
      const request = await storage.updatePriceChangeRequest(id, {
        status: 'rejected',
        reviewedBy: req.user!.id,
        reviewedAt: new Date(),
      });

      res.json(request);
    } catch (error) {
      console.error('Error rejecting price change request:', error);
      res.status(500).json({ message: 'Failed to reject price change request' });
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
      console.log('[bulk-upload] Starting materials bulk upload, user:', req.user?.email);

      if (!req.file) {
        console.log('[bulk-upload] No file provided');
        return res.status(400).json({ error: "No CSV file provided" });
      }

      console.log('[bulk-upload] File received:', req.file.originalname, 'size:', req.file.size);

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
          // Fix common enum value issues
          let location = record.location?.trim();
          if (!location || location === '' || location === 'OTH') location = 'DFW'; // Default invalid/empty location to DFW

          let productCategory = record.productCategory?.trim();
          if (productCategory === 'Garage Doors') productCategory = 'Garage Door';
          if (!productCategory || productCategory === '') productCategory = 'Other';

          // Handle empty manufacturer - default to "Other"
          let manufacturer = record.manufacturer?.trim();
          if (!manufacturer || manufacturer === '') manufacturer = 'Other';

          // Normalize distributor names to match schema enum values
          let rawDistributor = record.distributor?.trim();
          const distributorNormalization: { [key: string]: string } = {
            'ABC Supply': 'ABCSupply',
            'ABCSupply': 'ABCSupply',
            'ABC': 'ABCSupply',
            'Beacon': 'Beacon',
            'QXO': 'Beacon',
            'QXO Distribution': 'Beacon',
            'SRS Products': 'SRSProducts',
            'SRSProducts': 'SRSProducts',
            'SRS': 'SRSProducts',
            'Commercial Distributors': 'CommercialDistributors',
            'CommercialDistributors': 'CommercialDistributors',
            'CommericalDistributors': 'CommercialDistributors',
            'CDH': 'CommercialDistributors',
            'CDH Materials': 'CommercialDistributors',
            'Quality Trading House': 'Other',
            'QTH': 'Other',
            'Other': 'Other',
          };
          const distributor = distributorNormalization[rawDistributor] || 'Other';

          // Auto-generate ticker symbol based on normalized distributor
          let tickerSymbol = record.tickerSymbol?.trim();
          if (!tickerSymbol) {
            const distributorTickerMap: { [key: string]: string } = {
              'ABCSupply': 'ABC',
              'Beacon': 'QXO',
              'SRSProducts': 'SRS',
              'CommercialDistributors': 'CDH',
              'Other': 'OTH'
            };
            tickerSymbol = distributorTickerMap[distributor] || 'OTH';
          }

          // Validate required fields
          const materialData = {
            name: record.name?.trim(),
            location: location,
            manufacturer: manufacturer,
            productCategory: productCategory,
            distributor: distributor,
            currentPrice: record.currentPrice?.toString().trim(),
            tickerSymbol: tickerSymbol,
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
      console.error("[bulk-upload] CSV upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Internal server error during CSV upload";
      res.status(500).json({ error: errorMessage });
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

  // Price history upload endpoint
  app.post("/api/price-history/upload", requireAdmin, upload.single('file'), async (req, res) => {
    try {
      console.log('[price-history-upload] Starting price history upload, user:', req.user?.email);

      if (!req.file) {
        console.log('[price-history-upload] No file provided');
        return res.status(400).json({ error: "No CSV file provided" });
      }

      console.log('[price-history-upload] File received:', req.file.originalname, 'size:', req.file.size);

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

      // Helper function to parse various date formats
      const parseDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;

        const trimmed = dateStr.trim();

        // Try YYYY-MM-DD format first
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
          const date = new Date(trimmed + 'T12:00:00Z');
          if (!isNaN(date.getTime())) return date;
        }

        // Try M/D/YYYY or MM/DD/YYYY format
        const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (slashMatch) {
          const [, month, day, year] = slashMatch;
          const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0));
          if (!isNaN(date.getTime())) return date;
        }

        // Fallback: try native Date parsing
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) return date;

        return null;
      };

      // Process each record
      for (let i = 0; i < records.length; i++) {
        const record = records[i] as any;
        const rowNumber = i + 2; // +2 because CSV has header row and arrays are 0-indexed

        try {
          // Find the material by name, distributor, and location
          const material = await storage.findMaterialByDetails(
            record.materialName?.trim(),
            record.distributor?.trim(),
            record.location?.trim()
          );

          if (!material) {
            results.errors.push({
              row: rowNumber,
              error: `Material not found: ${record.materialName} - ${record.distributor} - ${record.location}`,
            });
            continue;
          }

          // Parse the change date from CSV
          const changeDate = parseDate(record.changeDate);
          if (!changeDate) {
            results.errors.push({
              row: rowNumber,
              error: `Invalid date format: ${record.changeDate}. Use YYYY-MM-DD or M/D/YYYY format.`,
            });
            continue;
          }

          // Create price history record with the historical date
          await storage.addPriceHistory({
            materialId: material.id,
            oldPrice: record.oldPrice?.toString().trim(),
            newPrice: record.newPrice?.toString().trim(),
            submittedBy: req.user!.id,
            status: 'approved' as const,
            approvedBy: req.user!.id,
            notes: record.changeReason?.trim() || 'Historical data import',
            submittedAt: changeDate,
          });
          results.success++;

        } catch (error) {
          let errorMessage = "Unknown error";

          if (error instanceof Error) {
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
      console.error("Price history upload error:", error);
      res.status(500).json({ error: "Internal server error during price history upload" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
