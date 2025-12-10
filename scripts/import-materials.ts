#!/usr/bin/env tsx

/**
 * Material Import Script
 *
 * This script imports materials from the SQLite database into Supabase.
 * It handles data transformation, validation, batching, and error handling.
 *
 * Usage:
 *   tsx scripts/import-materials.ts [--dry-run] [--batch-size=50]
 *
 * Options:
 *   --dry-run       Preview changes without writing to Supabase
 *   --batch-size=N  Set batch size (default: 50)
 *
 * Environment Variables Required:
 *   SUPABASE_URL              - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Supabase service role key (admin access)
 */

import 'dotenv/config';
import Database from 'better-sqlite3';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// ============================================================================
// Configuration
// ============================================================================

const SQLITE_DB_PATH = '/Users/cojovi/dev/material_tracker/database_files/cmac_master.db';
const DEFAULT_BATCH_SIZE = 50;
const SUPABASE_TABLE = 'materials';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const batchSizeArg = args.find(arg => arg.startsWith('--batch-size='));
const batchSize = batchSizeArg
  ? parseInt(batchSizeArg.split('=')[1], 10)
  : DEFAULT_BATCH_SIZE;

// ============================================================================
// Type Definitions
// ============================================================================

interface SQLiteMaterial {
  id: number;
  name: string;
  location: string | null;
  manufacturer: string | null;
  product_category: string | null;
  distributor: string | null;
  ticker_symbol: string | null;
  current_price: number | null;
  previous_price: number | null;
  last_updated: string | null;
  updated_by: number | null;
}

interface SupabaseMaterial {
  name: string;
  location: string;
  manufacturer: string;
  product_category: string;
  distributor: string;
  ticker_symbol: string;
  current_price: string;
  previous_price: string | null;
  last_updated: string;
  updated_by: string | null;
}

interface ImportStats {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  errors: Array<{
    row: number;
    material: string;
    error: string;
  }>;
}

// ============================================================================
// Environment Validation
// ============================================================================

function validateEnvironment(): { url: string; key: string } {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const errors: string[] = [];

  if (!url) {
    errors.push(
      '❌ SUPABASE_URL is not set\n' +
      '   Get this from: Supabase Dashboard > Project Settings > API > Project URL'
    );
  }

  if (!key) {
    errors.push(
      '❌ SUPABASE_SERVICE_ROLE_KEY is not set\n' +
      '   Get this from: Supabase Dashboard > Project Settings > API > service_role key\n' +
      '   ⚠️  WARNING: Keep this key secret! It bypasses Row Level Security.'
    );
  }

  if (errors.length > 0) {
    console.error('\n🚫 Environment validation failed:\n');
    errors.forEach(err => console.error(err));
    console.error('\nPlease add these environment variables to your .env file.\n');
    process.exit(1);
  }

  return { url: url!, key: key! };
}

// ============================================================================
// Data Transformation
// ============================================================================

const VALID_LOCATIONS = ["DFW", "ATX", "HOU", "OKC", "ATL", "ARK", "NSH"] as const;
const VALID_MANUFACTURERS = [
  "Atlas", "Malarky", "Tri-Built", "CertainTeed", "Tamko",
  "GAF", "Owens Corning", "IKO", "Other"
] as const;
const VALID_PRODUCT_CATEGORIES = [
  "Shingle", "Accessory", "Decking", "Underlayment",
  "Ventilation", "Flashing", "Garage Door", "Door Motor", "Other"
] as const;
const VALID_DISTRIBUTORS = ["ABCSupply", "Beacon", "SRSProducts", "CommercialDistributors", "Other"] as const;
const VALID_TICKER_SYMBOLS = ["ABC", "QXO", "SRS", "CDH", "OTH"] as const;

function normalizeEnum<T extends readonly string[]>(
  value: string | null | undefined,
  validValues: T,
  defaultValue: T[number]
): T[number] {
  if (!value) return defaultValue;

  const normalized = value.trim();
  const found = validValues.find(
    v => v.toLowerCase() === normalized.toLowerCase()
  );

  return found || defaultValue;
}

function transformMaterial(sqlite: SQLiteMaterial): SupabaseMaterial | null {
  try {
    // Required fields validation
    if (!sqlite.name || !sqlite.name.trim()) {
      throw new Error('Material name is required');
    }

    // Transform location
    const location = normalizeEnum(sqlite.location, VALID_LOCATIONS, 'DFW');

    // Transform manufacturer
    const manufacturer = normalizeEnum(sqlite.manufacturer, VALID_MANUFACTURERS, 'Other');

    // Transform product category
    const productCategory = normalizeEnum(
      sqlite.product_category,
      VALID_PRODUCT_CATEGORIES,
      'Other'
    );

    // Transform distributor
    const distributor = normalizeEnum(sqlite.distributor, VALID_DISTRIBUTORS, 'Other');

    // Transform ticker symbol
    const tickerSymbol = normalizeEnum(
      sqlite.ticker_symbol,
      VALID_TICKER_SYMBOLS,
      'OTH'
    );

    // Validate and format prices
    const currentPrice = sqlite.current_price != null
      ? sqlite.current_price.toFixed(2)
      : '0.00';

    const previousPrice = sqlite.previous_price != null
      ? sqlite.previous_price.toFixed(2)
      : null;

    // Handle timestamp
    const lastUpdated = sqlite.last_updated || new Date().toISOString();

    // Handle updated_by - convert to UUID or null
    // Since SQLite has integer IDs, we'll set to null and let Supabase handle it
    const updatedBy = null;

    return {
      name: sqlite.name.trim(),
      location,
      manufacturer,
      product_category: productCategory,
      distributor,
      ticker_symbol: tickerSymbol,
      current_price: currentPrice,
      previous_price: previousPrice,
      last_updated: lastUpdated,
      updated_by: updatedBy,
    };
  } catch (error) {
    console.error(`Transform error for material "${sqlite.name}":`, error);
    return null;
  }
}

// ============================================================================
// Database Operations
// ============================================================================

function readSQLiteMaterials(dbPath: string): SQLiteMaterial[] {
  console.log(`\n📖 Reading materials from SQLite database: ${dbPath}`);

  try {
    const db = new Database(dbPath, { readonly: true });

    const materials = db.prepare(`
      SELECT
        id, name, location, manufacturer, product_category,
        distributor, ticker_symbol, current_price, previous_price,
        last_updated, updated_by
      FROM materials
      ORDER BY id
    `).all() as SQLiteMaterial[];

    db.close();

    console.log(`✅ Successfully read ${materials.length} materials from SQLite`);
    return materials;
  } catch (error) {
    console.error('❌ Failed to read SQLite database:', error);
    throw error;
  }
}

async function insertBatchToSupabase(
  client: SupabaseClient,
  materials: SupabaseMaterial[],
  stats: ImportStats,
  batchNumber: number,
  totalBatches: number
): Promise<void> {
  const startIdx = (batchNumber - 1) * materials.length;

  console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${materials.length} materials)...`);

  if (isDryRun) {
    console.log('🔍 DRY RUN - Would insert the following materials:');
    materials.forEach((m, idx) => {
      console.log(`  ${startIdx + idx + 1}. ${m.name} (${m.location}, ${m.manufacturer})`);
    });
    stats.successful += materials.length;
    return;
  }

  try {
    const { data, error } = await client
      .from(SUPABASE_TABLE)
      .insert(materials)
      .select();

    if (error) {
      throw error;
    }

    stats.successful += materials.length;
    console.log(`✅ Batch ${batchNumber}/${totalBatches} completed successfully`);

  } catch (error: any) {
    // Handle batch errors - try individual inserts
    console.warn(`⚠️  Batch insert failed, attempting individual inserts...`);

    for (let i = 0; i < materials.length; i++) {
      const material = materials[i];
      const rowNumber = startIdx + i + 1;

      try {
        const { error: insertError } = await client
          .from(SUPABASE_TABLE)
          .insert(material);

        if (insertError) {
          throw insertError;
        }

        stats.successful++;
        console.log(`  ✓ ${rowNumber}/${stats.total}: ${material.name}`);

      } catch (individualError: any) {
        stats.failed++;
        const errorMsg = individualError.message || String(individualError);
        stats.errors.push({
          row: rowNumber,
          material: material.name,
          error: errorMsg,
        });
        console.error(`  ✗ ${rowNumber}/${stats.total}: ${material.name} - ${errorMsg}`);
      }
    }
  }
}

// ============================================================================
// Main Import Process
// ============================================================================

async function importMaterials(): Promise<void> {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║          Material Import Script - SQLite to Supabase          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  if (isDryRun) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made to Supabase');
  }

  console.log(`\n⚙️  Configuration:`);
  console.log(`   - Source: ${SQLITE_DB_PATH}`);
  console.log(`   - Target: Supabase (${SUPABASE_TABLE} table)`);
  console.log(`   - Batch size: ${batchSize}`);
  console.log(`   - Mode: ${isDryRun ? 'DRY RUN' : 'LIVE IMPORT'}`);

  // Validate environment
  const { url, key } = validateEnvironment();

  // Initialize stats
  const stats: ImportStats = {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Step 1: Read materials from SQLite
    const sqliteMaterials = readSQLiteMaterials(SQLITE_DB_PATH);
    stats.total = sqliteMaterials.length;

    if (stats.total === 0) {
      console.log('\n⚠️  No materials found in SQLite database. Nothing to import.');
      return;
    }

    // Step 2: Transform data
    console.log('\n🔄 Transforming materials...');
    const transformedMaterials: SupabaseMaterial[] = [];

    for (let i = 0; i < sqliteMaterials.length; i++) {
      const sqlite = sqliteMaterials[i];
      const transformed = transformMaterial(sqlite);

      if (transformed) {
        transformedMaterials.push(transformed);
      } else {
        stats.skipped++;
        stats.errors.push({
          row: i + 1,
          material: sqlite.name || 'Unknown',
          error: 'Transformation failed',
        });
      }
    }

    console.log(`✅ Transformed ${transformedMaterials.length} materials`);
    if (stats.skipped > 0) {
      console.log(`⚠️  Skipped ${stats.skipped} materials due to transformation errors`);
    }

    // Step 3: Initialize Supabase client
    if (!isDryRun) {
      console.log('\n🔌 Connecting to Supabase...');
    }

    const supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    // Test connection (only in live mode)
    if (!isDryRun) {
      const { error: testError } = await supabase
        .from(SUPABASE_TABLE)
        .select('count')
        .limit(1);

      if (testError) {
        throw new Error(`Supabase connection test failed: ${testError.message}`);
      }
      console.log('✅ Connected to Supabase successfully');
    }

    // Step 4: Insert materials in batches
    console.log(`\n📤 Importing ${transformedMaterials.length} materials to Supabase...`);

    const totalBatches = Math.ceil(transformedMaterials.length / batchSize);

    for (let i = 0; i < transformedMaterials.length; i += batchSize) {
      const batch = transformedMaterials.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;

      await insertBatchToSupabase(
        supabase,
        batch,
        stats,
        batchNumber,
        totalBatches
      );

      // Add a small delay between batches to avoid rate limiting
      if (!isDryRun && i + batchSize < transformedMaterials.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Step 5: Report results
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                        Import Complete                         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successful: ${stats.successful}/${stats.total}`);
    console.log(`   ❌ Failed:     ${stats.failed}/${stats.total}`);
    console.log(`   ⏭️  Skipped:    ${stats.skipped}/${stats.total}`);

    if (stats.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered (${stats.errors.length}):`);
      stats.errors.forEach(err => {
        console.log(`   Row ${err.row}: ${err.material}`);
        console.log(`      → ${err.error}`);
      });
    }

    if (isDryRun) {
      console.log('\n🔍 DRY RUN COMPLETE - No changes were made to Supabase');
      console.log('   Run without --dry-run flag to perform the actual import\n');
    } else {
      console.log(`\n✨ Import completed successfully!\n`);
    }

    // Exit with appropriate code
    process.exit(stats.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Import failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// ============================================================================
// Script Entry Point
// ============================================================================

// Auto-execute when run directly (ES module compatible)
importMaterials().catch(error => {
  console.error('\n💥 Unhandled error:', error);
  process.exit(1);
});

export { importMaterials, transformMaterial };
