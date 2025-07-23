import { Router } from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { storage } from "../storage";
import { insertMaterialSchema, LOCATIONS, DISTRIBUTORS, MANUFACTURERS, PRODUCT_CATEGORIES } from "@shared/schema";
import { z } from "zod";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Bulk CSV upload endpoint
router.post("/bulk-upload", upload.single('csv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No CSV file provided" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
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
        await storage.createMaterial(validatedData, req.user.id);
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

export { router as materialsUploadRouter };