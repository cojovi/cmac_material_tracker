# MaterialTracker - Stock Market Style Material Pricing Dashboard

## Overview

MaterialTracker is a sophisticated real-time material pricing management system designed for construction material distributors. The application features a stock market-style interface with aurora theming, comprehensive analytics, and role-based access control. Built with React, TypeScript, and Drizzle ORM, it provides real-time material pricing updates, price change workflows, and historical analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React 18 with TypeScript, providing a modern component-based architecture. The application uses:
- **UI Framework**: Shadcn UI components with Radix UI primitives for consistent design
- **Styling**: Tailwind CSS with custom Aurora Dreams color palette
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Charts**: Recharts for interactive data visualizations

The frontend follows a component-driven architecture with clear separation between UI components, pages, and business logic hooks.

### Backend Architecture
The backend is built with Express.js and follows a RESTful API design:
- **Server Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy and session-based auth
- **Database Layer**: Drizzle ORM with PostgreSQL (Neon serverless)
- **External Integrations**: Slack Web API for notifications
- **Development**: Vite for hot module replacement and development server

### Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM:
- **Database Provider**: Neon serverless PostgreSQL
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations for database versioning
- **Session Storage**: PostgreSQL session store using connect-pg-simple

## Key Components

### Authentication System
- **Strategy**: Local authentication with bcrypt password hashing
- **Session Management**: Express sessions with PostgreSQL storage
- **Authorization**: Role-based access control (admin vs standard users)
- **Security**: Input validation, CSRF protection, and secure session handling

### Material Management
- **Core Entity**: Materials with comprehensive tracking (name, location, manufacturer, category, distributor)
- **Price Tracking**: Historical price changes with audit trail
- **Stock Ticker Integration**: Real-time price display with ticker symbols
- **Multi-Location Support**: Coverage across DFW, ATX, HOU, OKC, ATL, ARK, NSH

### Dashboard Features
- **Real-time Updates**: Automatic refresh every 10 minutes with manual refresh capability
- **Stock Market UI**: Scrolling ticker, interactive charts, and live price feeds
- **Analytics**: Performance metrics, trend analysis, and regional comparisons
- **Price Change Workflows**: Request/approval system for standard users, direct updates for admins

### External Integrations
- **Slack Notifications**: Automated alerts for price changes and approvals
- **API Design**: RESTful endpoints for all operations
- **Real-time Data**: Periodic refresh mechanisms for live data updates

## Data Flow

### Price Update Workflow
1. **Standard Users**: Submit price change requests through form
2. **Slack Integration**: Notifications sent to configured channel
3. **Admin Approval**: Admins review and approve/reject requests
4. **Database Update**: Approved changes update material prices and history
5. **Real-time Sync**: Dashboard updates reflect changes across all users

### Data Refresh Cycle
1. **Periodic Updates**: Every 10 minutes automatic data refresh
2. **Manual Refresh**: User-triggered refresh button
3. **Query Invalidation**: React Query cache invalidation for fresh data
4. **Live Dashboard**: Real-time price movements and trend updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@slack/web-api**: Slack integration for notifications
- **recharts**: Data visualization and charting
- **@radix-ui/***: UI component primitives

### Authentication & Security
- **passport**: Authentication middleware
- **bcryptjs**: Password hashing
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Development server and build tool
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Type safety across the application

## Deployment Strategy

### Environment Configuration
The application requires several environment variables:
- `DATABASE_URL`: PostgreSQL connection string (Neon)
- `SLACK_BOT_TOKEN`: Slack app bot token (optional)
- `SLACK_CHANNEL_ID`: Target Slack channel (optional)
- `SESSION_SECRET`: Session encryption secret

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database Migration**: Drizzle pushes schema changes to PostgreSQL
4. **Production Start**: Node.js serves bundled application

### Database Setup
The application uses Drizzle migrations for schema management:
- Initial schema creation through `drizzle-kit push`
- Automatic table creation for users, materials, price history, and requests
- Seed data can be added through the admin interface

### Scalability Considerations
- **Stateless Design**: Session storage in database enables horizontal scaling
- **Database Optimization**: Indexed queries for performance
- **Caching Strategy**: React Query provides efficient client-side caching
- **Real-time Updates**: Configurable refresh intervals to balance performance