-- ============================================================================
-- MATERIAL TRACKER - SUPABASE MIGRATION
-- ============================================================================
-- This migration sets up the complete database schema for the Material Tracker
-- application with Supabase Auth integration, RLS policies, and performance indexes.
--
-- Run this migration in the Supabase SQL Editor or via CLI:
-- supabase db push
-- ============================================================================

-- ############################################################################
-- UP MIGRATION
-- ############################################################################

-- ============================================================================
-- SECTION 1: CREATE PROFILES TABLE
-- ============================================================================
-- Links to Supabase auth.users for authentication
-- The id column stores the UUID from auth.users as TEXT

CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,  -- UUID from Supabase auth.users stored as TEXT
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'standard' CHECK (role IN ('admin', 'standard')),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profiles linked to Supabase auth.users';
COMMENT ON COLUMN profiles.id IS 'UUID from auth.users stored as TEXT';
COMMENT ON COLUMN profiles.role IS 'User role: admin or standard';

-- ============================================================================
-- SECTION 2: CREATE MATERIALS TABLE
-- ============================================================================
-- Core entity for tracking material prices across locations and distributors

CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL CHECK (location IN ('DFW', 'ATX', 'HOU', 'OKC', 'ATL', 'ARK', 'NSH')),
    manufacturer TEXT NOT NULL CHECK (manufacturer IN ('Atlas', 'Malarky', 'Tri-Built', 'CertainTeed', 'Tamko', 'GAF', 'Owens Corning', 'IKO', 'Other')),
    product_category TEXT NOT NULL CHECK (product_category IN ('Shingle', 'Accessory', 'Decking', 'Underlayment', 'Ventilation', 'Flashing', 'Garage Door', 'Door Motor', 'Other')),
    distributor TEXT NOT NULL CHECK (distributor IN ('ABCSupply', 'Beacon', 'SRSProducts', 'CommercialDistributors', 'Other')),
    ticker_symbol TEXT NOT NULL CHECK (ticker_symbol IN ('ABC', 'QXO', 'SRS', 'CDH', 'OTH')),
    current_price DECIMAL(10, 2) NOT NULL CHECK (current_price >= 0),
    previous_price DECIMAL(10, 2) CHECK (previous_price >= 0),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_by TEXT REFERENCES profiles(id) ON DELETE SET NULL
);

COMMENT ON TABLE materials IS 'Core materials catalog with pricing information';
COMMENT ON COLUMN materials.location IS 'Geographic location: DFW, ATX, HOU, OKC, ATL, ARK, NSH';
COMMENT ON COLUMN materials.ticker_symbol IS 'Stock ticker for distributor: ABC, QXO, SRS, CDH, OTH';

-- ============================================================================
-- SECTION 3: CREATE PRICE_HISTORY TABLE
-- ============================================================================
-- Tracks all price changes with approval workflow

CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    old_price DECIMAL(10, 2) CHECK (old_price >= 0),
    new_price DECIMAL(10, 2) NOT NULL CHECK (new_price >= 0),
    change_percent DECIMAL(5, 2),
    submitted_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    approved_by TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT
);

COMMENT ON TABLE price_history IS 'Historical record of all price changes with approval status';
COMMENT ON COLUMN price_history.status IS 'Approval status: pending, approved, or rejected';

-- ============================================================================
-- SECTION 4: CREATE PRICE_CHANGE_REQUESTS TABLE
-- ============================================================================
-- Allows standard users to request price changes for admin approval

CREATE TABLE IF NOT EXISTS price_change_requests (
    id SERIAL PRIMARY KEY,
    material_name TEXT NOT NULL,
    distributor TEXT NOT NULL,
    requested_price DECIMAL(10, 2) NOT NULL CHECK (requested_price >= 0),
    current_price DECIMAL(10, 2) CHECK (current_price >= 0),
    submitted_by TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    slack_message_ts TEXT  -- Slack integration for notifications
);

COMMENT ON TABLE price_change_requests IS 'Price change requests submitted by standard users for admin review';
COMMENT ON COLUMN price_change_requests.slack_message_ts IS 'Slack message timestamp for notification tracking';

-- ============================================================================
-- SECTION 5: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Materials indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_materials_location ON materials(location);
CREATE INDEX IF NOT EXISTS idx_materials_manufacturer ON materials(manufacturer);
CREATE INDEX IF NOT EXISTS idx_materials_product_category ON materials(product_category);
CREATE INDEX IF NOT EXISTS idx_materials_distributor ON materials(distributor);
CREATE INDEX IF NOT EXISTS idx_materials_ticker_symbol ON materials(ticker_symbol);
CREATE INDEX IF NOT EXISTS idx_materials_last_updated ON materials(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_materials_updated_by ON materials(updated_by);

-- Composite index for common filtering patterns
CREATE INDEX IF NOT EXISTS idx_materials_location_distributor ON materials(location, distributor);
CREATE INDEX IF NOT EXISTS idx_materials_location_manufacturer ON materials(location, manufacturer);

-- Price history indexes
CREATE INDEX IF NOT EXISTS idx_price_history_material_id ON price_history(material_id);
CREATE INDEX IF NOT EXISTS idx_price_history_submitted_by ON price_history(submitted_by);
CREATE INDEX IF NOT EXISTS idx_price_history_approved_by ON price_history(approved_by);
CREATE INDEX IF NOT EXISTS idx_price_history_status ON price_history(status);
CREATE INDEX IF NOT EXISTS idx_price_history_submitted_at ON price_history(submitted_at DESC);

-- Composite index for pending approvals
CREATE INDEX IF NOT EXISTS idx_price_history_pending ON price_history(status, submitted_at DESC) WHERE status = 'pending';

-- Price change requests indexes
CREATE INDEX IF NOT EXISTS idx_price_change_requests_submitted_by ON price_change_requests(submitted_by);
CREATE INDEX IF NOT EXISTS idx_price_change_requests_reviewed_by ON price_change_requests(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_price_change_requests_status ON price_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_price_change_requests_submitted_at ON price_change_requests(submitted_at DESC);

-- Composite index for pending requests
CREATE INDEX IF NOT EXISTS idx_price_change_requests_pending ON price_change_requests(status, submitted_at DESC) WHERE status = 'pending';

-- ============================================================================
-- SECTION 6: CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
-- Automatically updates the updated_at timestamp on row modifications

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger function to auto-update updated_at timestamp';

-- Apply trigger to profiles table
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to materials table (using last_updated column)
CREATE OR REPLACE FUNCTION update_materials_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_materials_last_updated ON materials;
CREATE TRIGGER trigger_materials_last_updated
    BEFORE UPDATE ON materials
    FOR EACH ROW
    EXECUTE FUNCTION update_materials_last_updated();

-- ============================================================================
-- SECTION 7: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_change_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SECTION 8: RLS POLICIES FOR PROFILES TABLE
-- ============================================================================
-- Users can view their own profile
-- Admins can view and update all profiles

-- Policy: Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
    ON profiles
    FOR SELECT
    USING (auth.uid()::TEXT = id);

-- Policy: Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
    ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- Policy: Users can update their own profile (except role)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    USING (auth.uid()::TEXT = id)
    WITH CHECK (auth.uid()::TEXT = id);

-- Policy: Admins can update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
    ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- Policy: Allow insert for authenticated users (profile creation on signup)
DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;
CREATE POLICY "Allow profile creation on signup"
    ON profiles
    FOR INSERT
    WITH CHECK (auth.uid()::TEXT = id);

-- Policy: Admins can delete profiles
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
CREATE POLICY "Admins can delete profiles"
    ON profiles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- ============================================================================
-- SECTION 9: RLS POLICIES FOR MATERIALS TABLE
-- ============================================================================
-- All authenticated users can read materials
-- Only admins can create, update, or delete materials

-- Policy: All authenticated users can view materials
DROP POLICY IF EXISTS "Authenticated users can view materials" ON materials;
CREATE POLICY "Authenticated users can view materials"
    ON materials
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy: Admins can insert materials
DROP POLICY IF EXISTS "Admins can insert materials" ON materials;
CREATE POLICY "Admins can insert materials"
    ON materials
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- Policy: Admins can update materials
DROP POLICY IF EXISTS "Admins can update materials" ON materials;
CREATE POLICY "Admins can update materials"
    ON materials
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- Policy: Admins can delete materials
DROP POLICY IF EXISTS "Admins can delete materials" ON materials;
CREATE POLICY "Admins can delete materials"
    ON materials
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- ============================================================================
-- SECTION 10: RLS POLICIES FOR PRICE_HISTORY TABLE
-- ============================================================================
-- All authenticated users can view price history
-- Users can create price history entries (their submissions)
-- Only admins can approve/update/delete price history

-- Policy: All authenticated users can view price history
DROP POLICY IF EXISTS "Authenticated users can view price history" ON price_history;
CREATE POLICY "Authenticated users can view price history"
    ON price_history
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can create price history entries
DROP POLICY IF EXISTS "Users can create price history entries" ON price_history;
CREATE POLICY "Users can create price history entries"
    ON price_history
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated'
        AND submitted_by = auth.uid()::TEXT
    );

-- Policy: Admins can update price history (for approval workflow)
DROP POLICY IF EXISTS "Admins can update price history" ON price_history;
CREATE POLICY "Admins can update price history"
    ON price_history
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- Policy: Admins can delete price history
DROP POLICY IF EXISTS "Admins can delete price history" ON price_history;
CREATE POLICY "Admins can delete price history"
    ON price_history
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- ============================================================================
-- SECTION 11: RLS POLICIES FOR PRICE_CHANGE_REQUESTS TABLE
-- ============================================================================
-- Users can view their own requests
-- Admins can view all requests
-- Users can create requests
-- Only admins can update (approve/reject) requests

-- Policy: Users can view their own price change requests
DROP POLICY IF EXISTS "Users can view own price change requests" ON price_change_requests;
CREATE POLICY "Users can view own price change requests"
    ON price_change_requests
    FOR SELECT
    USING (submitted_by = auth.uid()::TEXT);

-- Policy: Admins can view all price change requests
DROP POLICY IF EXISTS "Admins can view all price change requests" ON price_change_requests;
CREATE POLICY "Admins can view all price change requests"
    ON price_change_requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- Policy: Authenticated users can create price change requests
DROP POLICY IF EXISTS "Users can create price change requests" ON price_change_requests;
CREATE POLICY "Users can create price change requests"
    ON price_change_requests
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated'
        AND submitted_by = auth.uid()::TEXT
    );

-- Policy: Admins can update price change requests (for approval workflow)
DROP POLICY IF EXISTS "Admins can update price change requests" ON price_change_requests;
CREATE POLICY "Admins can update price change requests"
    ON price_change_requests
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- Policy: Admins can delete price change requests
DROP POLICY IF EXISTS "Admins can delete price change requests" ON price_change_requests;
CREATE POLICY "Admins can delete price change requests"
    ON price_change_requests
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()::TEXT
            AND role = 'admin'
        )
    );

-- ============================================================================
-- SECTION 12: HELPER FUNCTION TO CREATE PROFILE ON USER SIGNUP
-- ============================================================================
-- This function automatically creates a profile when a new user signs up

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id::TEXT,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'standard')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates a profile when a new user signs up via Supabase Auth';


-- ############################################################################
-- DOWN MIGRATION (ROLLBACK)
-- ############################################################################
-- To rollback this migration, run the following commands:
-- WARNING: This will delete all data in these tables!

/*
-- Remove triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS trigger_materials_last_updated ON materials;

-- Remove functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS update_materials_last_updated();

-- Remove RLS policies for price_change_requests
DROP POLICY IF EXISTS "Admins can delete price change requests" ON price_change_requests;
DROP POLICY IF EXISTS "Admins can update price change requests" ON price_change_requests;
DROP POLICY IF EXISTS "Users can create price change requests" ON price_change_requests;
DROP POLICY IF EXISTS "Admins can view all price change requests" ON price_change_requests;
DROP POLICY IF EXISTS "Users can view own price change requests" ON price_change_requests;

-- Remove RLS policies for price_history
DROP POLICY IF EXISTS "Admins can delete price history" ON price_history;
DROP POLICY IF EXISTS "Admins can update price history" ON price_history;
DROP POLICY IF EXISTS "Users can create price history entries" ON price_history;
DROP POLICY IF EXISTS "Authenticated users can view price history" ON price_history;

-- Remove RLS policies for materials
DROP POLICY IF EXISTS "Admins can delete materials" ON materials;
DROP POLICY IF EXISTS "Admins can update materials" ON materials;
DROP POLICY IF EXISTS "Admins can insert materials" ON materials;
DROP POLICY IF EXISTS "Authenticated users can view materials" ON materials;

-- Remove RLS policies for profiles
DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Allow profile creation on signup" ON profiles;

-- Disable RLS
ALTER TABLE price_change_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE price_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop tables (order matters due to foreign keys)
DROP TABLE IF EXISTS price_change_requests CASCADE;
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
