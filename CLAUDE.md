# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CMACMaterialTracker is a stock market-style material pricing dashboard for construction material distributors. It tracks pricing changes across multiple locations (DFW, ATX, HOU, OKC, ATL, ARK, NSH) and distributors (ABC Supply, Beacon, SRS Products, Commercial Distributors) with real-time updates, Slack notifications, and comprehensive analytics.

## Tech Stack

- **Frontend**: React 18 + TypeScript, Tailwind CSS, Shadcn UI, Recharts, Framer Motion, Wouter (routing), React Query
- **Backend**: Express.js + TypeScript, Passport.js (authentication), Multer (CSV uploads)
- **Database**: Neon PostgreSQL (serverless) via Drizzle ORM
- **Integrations**: Slack Web API for notifications

## Development Commands

```bash
# Start development server (client + API on port 5000)
npm run dev

# Type check (does not emit files)
npm run check

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push          # Push schema changes to database
```

## Architecture

### Database Schema (shared/schema.ts)

The application uses Drizzle ORM with four main tables:

1. **users** - Authentication and role management (admin/standard)
2. **materials** - Core entity with name, location, manufacturer, category, distributor, ticker symbol, current/previous price
3. **priceHistory** - Audit trail of price changes with approval workflow (pending/approved/rejected)
4. **priceChangeRequests** - Standard user requests for price updates (requires admin approval)

Key enums defined in schema:
- LOCATIONS: ["DFW", "ATX", "HOU", "OKC", "ATL", "ARK", "NSH"]
- MANUFACTURERS: ["Atlas", "Malarky", "Tri-Built", "CertainTeed", "Tamko", "GAF", "Owens Corning", "IKO", "Other"]
- PRODUCT_CATEGORIES: ["Shingle", "Accessory", "Decking", "Underlayment", "Ventilation", "Flashing", "Garage Door", "Door Motor", "Other"]
- DISTRIBUTORS: Maps distributor names to ticker symbols (ABCSupply→ABC, Beacon→QXO, etc.)

### Backend Structure

- **server/index.ts** - Express server setup with logging middleware
- **server/routes.ts** - All API routes with authentication/authorization middleware
- **server/storage.ts** - Database operations layer (IStorage interface implementation)
- **server/services/slack.ts** - Slack notification integration
- **server/vite.ts** - Vite dev server setup for development

### Frontend Structure

- **client/src/App.tsx** - Root component with QueryClient, AuthProvider, routing (Wouter)
- **client/src/pages/** - Page components (dashboard, materials, material-detail, price-history, analytics, pending-requests, login)
- **client/src/components/dashboard/** - Dashboard-specific components (stats, charts, modals, forms)
- **client/src/components/ui/** - Shadcn UI components (reusable design system)
- **client/src/hooks/** - Custom hooks (use-auth.tsx, use-toast.ts, use-mobile.tsx)
- **client/src/lib/** - Utilities (utils.ts, queryClient.ts, auth.ts)

### Key Workflows

1. **Authentication**: Passport.js local strategy with express-session. Session stored in memory (development) or PostgreSQL (production).

2. **Admin Price Updates**: Admins can directly update material prices via PATCH /api/materials/:id. Price history is automatically created with approval status.

3. **Standard User Requests**: Standard users submit price change requests via POST /api/price-change-requests. Slack notifications sent to admins with approve/reject buttons.

4. **Slack Integration**:
   - POST /api/slack/interactive handles Slack button interactions
   - On approval: Updates material price and creates price history
   - Material matching logic: Tries name+currentPrice first, falls back to name-only

5. **Bulk Operations**:
   - POST /api/materials/bulk-upload - CSV upload for materials (auto-normalizes distributor names, handles missing data)
   - POST /api/price-history/upload - CSV upload for historical price data with custom date parsing

### Important Route Ordering

In server/routes.ts, specific routes MUST come before parameterized routes:
```typescript
app.get('/api/materials/search', ...)      // MUST be before /:id
app.get('/api/materials/trending', ...)    // MUST be before /:id
app.get('/api/materials/:id', ...)         // Catch-all for IDs
```

### Authentication Middleware

- `requireAuth` - Checks if user is authenticated (all protected routes)
- `requireAdmin` - Checks if user is authenticated AND has admin role

### CSV Upload Data Normalization

The bulk upload endpoints (server/routes.ts:615, server/routes.ts:756) include extensive data normalization:
- Empty/invalid locations default to "DFW"
- Empty manufacturers default to "Other"
- Distributor names normalized to schema enum values (e.g., "ABC Supply" → "ABCSupply")
- Ticker symbols auto-generated if missing
- Product categories normalized (e.g., "Garage Doors" → "Garage Door")
- Date parsing supports multiple formats (YYYY-MM-DD, M/D/YYYY)

### Material Matching Logic

When approving price change requests (Slack or manual), the system uses two-step material lookup:
1. Try findMaterialByNameAndPrice(name, currentPrice) - most accurate
2. Fallback to getMaterialByName(name) if step 1 fails

This is implemented in server/routes.ts:369 (Slack interactive) and server/routes.ts:522 (manual approval).

## Important Patterns

### Error Handling
- Slack notifications are "best-effort" - failures don't block requests
- CSV uploads return partial success with detailed error array per row

### Session Configuration
- Production uses secure cookies with 'trust proxy' enabled
- Session secret from SESSION_SECRET env var
- 24-hour cookie maxAge

### Database Queries
- All queries use Drizzle ORM typed queries
- Complex joins for MaterialWithHistory type (materials + price history + change calculations)
- Dashboard stats use SQL aggregations (COUNT, AVG, etc.)

## Environment Variables

Required:
- DATABASE_URL - Neon PostgreSQL connection string

Optional:
- SESSION_SECRET - Express session secret (defaults to 'your-secret-key')
- SLACK_BOT_TOKEN - Slack bot token for notifications
- SLACK_CHANNEL_ID - Slack channel for price change notifications
- NODE_ENV - 'development' or 'production'
- PORT - Server port (defaults to 5000)

## Common Pitfalls

1. **Route Order**: Always define specific routes before parameterized routes (e.g., /search before /:id)
2. **Distributor Names**: CSV uploads may use various names - normalization map in routes.ts:666 handles this
3. **Material Lookup**: When implementing price updates, always use the two-step lookup (name+price, then name-only)
4. **Enum Validation**: Schema enforces strict enums - use normalization for CSV imports
5. **Session Storage**: Development uses MemoryStore, production should use connect-pg-simple
6. **Date Handling**: Price history imports support multiple date formats - see parseDate function in routes.ts:788
