-- ============================================================
-- ModaMariaJose — Add 'curvy' category
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- Drop existing CHECK and recreate with 'curvy' included
ALTER TABLE productos DROP CONSTRAINT IF EXISTS productos_categoria_check;
ALTER TABLE productos ADD CONSTRAINT productos_categoria_check
  CHECK (categoria IN ('vestidos','blazers','abrigos','faldas','pantalones','blusas','curvy'));
