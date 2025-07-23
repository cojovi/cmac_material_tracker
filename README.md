# MaterialTracker - Stock Market Style Material Pricing Dashboard

A sophisticated, real-time material pricing management system with stock market-style interface, aurora theming, and comprehensive analytics. Built for construction material distributors to track pricing changes, manage inventory, and analyze market trends.

## 🚀 Features

### Core Functionality
- **Stock Market Style Dashboard** - Real-time material pricing with live ticker, interactive charts, and trend analysis
- **Aurora Dreams Theme** - Modern, futuristic interface with vibrant aurora color palette
- **Role-Based Access Control** - Admin and standard user permissions with Supabase authentication
- **Real-Time Data Updates** - Automatic refresh every 10 minutes with manual refresh capability
- **Price Change Workflows** - Standard user requests and admin direct updates
- **Slack Integration** - Automated notifications for price changes and approvals
- **Historical Analytics** - 12-month price tracking with interactive visualizations
- **Advanced Search & Filtering** - Comprehensive material search and category filtering

### Material Management
- **Comprehensive Material Data** - Name, Location, Manufacturer, Category, Distributor tracking
- **Multi-Location Support** - DFW, ATX, HOU, OKC, ATL, ARK, NSH coverage
- **Distributor Integration** - ABC Supply, Beacon, SRS Products, Commercial Distributors
- **Stock Ticker Symbols** - ABCSupply=ABC, Beacon=QXO, SRSProducts=SRS, etc.
- **Price History Tracking** - Complete audit trail with user attribution
- **Bulk Operations** - Import/export capabilities for large datasets

### Analytics & Reporting
- **Performance Dashboards** - Regional and distributor performance metrics
- **Trend Analysis** - Price movement patterns and forecasting
- **Interactive Charts** - Line graphs, bar charts, and custom visualizations
- **Custom Reports** - Generate reports by date range, location, or category
- **Data Export** - CSV/Excel export for external analysis
- **Real-Time Metrics** - Live dashboard statistics and KPIs

### Technical Features
- **Responsive Design** - Optimized for desktop, tablet, and TV displays
- **TV Display Mode** - Large fonts and enhanced visibility for office displays
- **Progressive Web App** - Offline capability and mobile installation
- **Security** - Row-level security, input validation, and secure sessions
- **Performance** - Optimized queries, caching, and efficient data loading
- **Monitoring** - Error tracking, performance monitoring, and health checks

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript for component architecture
- **Tailwind CSS** with custom Aurora theme configuration
- **Shadcn UI** components for consistent design system
- **Recharts** for interactive data visualizations
- **Framer Motion** for smooth animations and transitions
- **React Query** for efficient data fetching and caching
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript for API development
- **Supabase** PostgreSQL for database and authentication
- **Drizzle ORM** for type-safe database operations
- **Passport.js** for authentication strategies
- **Node-cron** for scheduled tasks and data refresh
- **Slack Web API** for team notifications
- **Express Session** for secure session management

### Database
- **Supabase PostgreSQL** with row-level security
- **Automated Migrations** via Drizzle Kit
- **Real-time Subscriptions** for live data updates
- **Backup & Recovery** automated daily backups
- **Performance Optimization** with indexed queries

## 📋 Prerequisites

- **Node.js** 18.0 or higher
- **npm** 8.0 or higher
- **Supabase Account** for database hosting
- **Slack Workspace** (optional) for notifications
- **Modern Browser** with JavaScript enabled

## 🚀 Quick Start

### 1. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com/dashboard/projects)
2. Navigate to your project dashboard
3. Click the "Connect" button in the top toolbar
4. Copy the URI from "Connection string" → "Transaction pooler"
5. Replace `[YOUR-PASSWORD]` with your database password

### 2. Environment Configuration

```bash
# Copy the environment template
cp .env.example .env

# Edit the .env file with your configuration
# At minimum, set DATABASE_URL and SESSION_SECRET
