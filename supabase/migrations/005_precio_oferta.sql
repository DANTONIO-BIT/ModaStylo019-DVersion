-- ============================================================
-- ModaMariaJose — Add precio_oferta column to productos
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE productos
  ADD COLUMN IF NOT EXISTS precio_oferta DECIMAL(10,2) DEFAULT NULL;

-- Set a couple of sample products on sale for testing
UPDATE productos SET precio_oferta = 59.00 WHERE nombre = 'Vestido Lino Sevilla';
UPDATE productos SET precio_oferta = 49.00 WHERE nombre = 'Falda Midi Crema';
