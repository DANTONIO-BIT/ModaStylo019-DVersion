-- ============================================================
-- ModaMariaJose — Color variants (optional)
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- JSONB column storing array of color variants:
-- [
--   { "id": "blanco", "imagenes": ["url1","url2"] },
--   { "id": "negro",  "imagenes": ["url3"] }
-- ]
-- NULL or empty array means the product has no color variants
-- and falls back to the base `imagenes` column.
ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS colores JSONB DEFAULT NULL;
