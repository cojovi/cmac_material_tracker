# Material Import Scripts

This directory contains scripts for importing data into the Supabase database.

## import-materials.ts

Imports materials from the SQLite database (`cmac_master.db`) into Supabase.

### Features

- **Reads from SQLite**: Connects to the local SQLite database and reads all 180 materials
- **Data Transformation**: Maps SQLite schema to Supabase schema with proper field transformations
- **Validation**: Validates all data against predefined enums and constraints
- **Batch Processing**: Imports materials in configurable batches (default: 50)
- **Error Handling**: Gracefully handles errors with detailed reporting
- **Dry Run Mode**: Preview changes before actual import
- **Progress Logging**: Real-time progress updates during import
- **Detailed Reporting**: Success/failure statistics with error details

### Prerequisites

1. **Environment Variables**: Ensure your `.env` file contains:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **SQLite Database**: The script expects the SQLite database at:
   ```
   /Users/cojovi/dev/material_tracker/database_files/cmac_master.db
   ```

### Usage

#### Dry Run (Preview Only)

Test the import without making any changes to Supabase:

```bash
npm run import:materials:dry-run
```

or

```bash
npx tsx scripts/import-materials.ts --dry-run
```

#### Live Import

Perform the actual import:

```bash
npm run import:materials
```

or

```bash
npx tsx scripts/import-materials.ts
```

#### Custom Batch Size

Import with a custom batch size (default is 50):

```bash
npx tsx scripts/import-materials.ts --batch-size=100
```

#### Combined Options

```bash
npx tsx scripts/import-materials.ts --dry-run --batch-size=25
```

### Data Transformation

The script performs the following transformations:

| SQLite Field | Supabase Field | Transformation |
|-------------|----------------|----------------|
| `id` | - | Omitted (auto-generated) |
| `name` | `name` | Trimmed, validated as required |
| `location` | `location` | Normalized to enum: DFW, ATX, HOU, OKC, ATL, ARK, NSH |
| `manufacturer` | `manufacturer` | Normalized to enum: Atlas, Malarky, Tri-Built, CertainTeed, Tamko, GAF, Owens Corning, IKO, Other |
| `product_category` | `product_category` | Normalized to enum: Shingle, Accessory, Decking, Underlayment, Ventilation, Flashing, Garage Door, Door Motor, Other |
| `distributor` | `distributor` | Normalized to enum: ABCSupply, Beacon, SRSProducts, CommercialDistributors, Other |
| `ticker_symbol` | `ticker_symbol` | Normalized to enum: ABC, QXO, SRS, CDH, OTH |
| `current_price` | `current_price` | Converted to decimal string (e.g., "123.45") |
| `previous_price` | `previous_price` | Converted to decimal string or null |
| `last_updated` | `last_updated` | ISO timestamp |
| `updated_by` | `updated_by` | Set to null (integer IDs not compatible with UUID) |

### Error Handling

The script includes comprehensive error handling:

1. **Environment Validation**: Checks for required environment variables before starting
2. **Database Connection**: Tests SQLite and Supabase connections
3. **Batch Fallback**: If batch insert fails, tries individual inserts
4. **Error Collection**: Collects all errors with row numbers and details
5. **Exit Codes**: Returns 0 on success, 1 on failure

### Output Examples

#### Successful Dry Run
```
╔════════════════════════════════════════════════════════════════╗
║          Material Import Script - SQLite to Supabase          ║
╚════════════════════════════════════════════════════════════════╝

🔍 DRY RUN MODE - No changes will be made to Supabase

⚙️  Configuration:
   - Source: /Users/cojovi/dev/material_tracker/database_files/cmac_master.db
   - Target: Supabase (materials table)
   - Batch size: 50
   - Mode: DRY RUN

📖 Reading materials from SQLite database...
✅ Successfully read 180 materials from SQLite

🔄 Transforming materials...
✅ Transformed 180 materials

📤 Importing 180 materials to Supabase...

📦 Processing batch 1/4 (50 materials)...
...

╔════════════════════════════════════════════════════════════════╗
║                        Import Complete                         ║
╚════════════════════════════════════════════════════════════════╝

📊 Summary:
   ✅ Successful: 180/180
   ❌ Failed:     0/180
   ⏭️  Skipped:    0/180
```

#### With Errors
```
📊 Summary:
   ✅ Successful: 175/180
   ❌ Failed:     3/180
   ⏭️  Skipped:    2/180

⚠️  Errors encountered (5):
   Row 23: Example Material
      → Transformation failed
   Row 45: Another Material
      → duplicate key value violates unique constraint
```

### Troubleshooting

#### Environment Variables Not Found
```
🚫 Environment validation failed:
❌ SUPABASE_URL is not set
```
**Solution**: Add the missing variables to your `.env` file

#### SQLite Database Not Found
```
❌ Failed to read SQLite database: ENOENT: no such file or directory
```
**Solution**: Verify the database path in the script configuration

#### Supabase Connection Failed
```
❌ Supabase connection test failed: Invalid API key
```
**Solution**: Verify your `SUPABASE_SERVICE_ROLE_KEY` in `.env`

#### Duplicate Key Errors
```
❌ duplicate key value violates unique constraint
```
**Solution**: The materials may already exist. Check Supabase for existing data or clear the table before importing

### Development

To modify the script:

1. Update field mappings in the `transformMaterial()` function
2. Adjust validation rules by modifying the enum constants
3. Change batch size or other configuration at the top of the file
4. Add new transformation logic as needed

### Type Safety

The script is fully typed with TypeScript, including:
- `SQLiteMaterial` - Source data structure
- `SupabaseMaterial` - Target data structure
- `ImportStats` - Import statistics and error tracking

### Performance

- **Batch Size**: 50 materials per batch (configurable)
- **Delay**: 100ms between batches to avoid rate limiting
- **Expected Time**: ~5-10 seconds for 180 materials (dry run is faster)

### Security

The script uses the Supabase service role key which bypasses Row Level Security. This is appropriate for:
- Administrative imports
- Batch operations
- System-level data migrations

Never expose the service role key in client-side code or public repositories.
