-- ============================================================
-- ModaMariaJose — Per-size pricing (optional)
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- JSONB column: { "XL": 95.00, "XXL": 105.00 }
-- NULL means every size uses the base `precio` column.
ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS precios_talla JSONB DEFAULT NULL;
