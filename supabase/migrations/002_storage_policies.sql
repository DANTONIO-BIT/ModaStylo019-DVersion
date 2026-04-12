-- ============================================================
-- ModaMariaJose — Storage bucket "products" policies
-- Run AFTER creating the bucket in Supabase Dashboard > Storage
--
-- Steps in Dashboard:
--   1. Storage > New bucket > name: "products" > Public bucket: ON
--   2. Then run this SQL in the SQL Editor
-- ============================================================

-- NOTE: no SELECT policy is needed.
-- The `products` bucket is set to Public, so image reads go through
-- /storage/v1/object/public/products/<path> and bypass RLS entirely.
-- Adding a public SELECT policy would only enable bucket LISTING
-- (storage.objects queries) — a small data exposure risk we don't need.
-- If you ran an earlier version of this migration that created a
-- "Public can read product images" policy, drop it via the Supabase
-- Dashboard warning banner or with:
--   DROP POLICY IF EXISTS "Public can read product images" ON storage.objects;

-- Only authenticated admin can upload
DROP POLICY IF EXISTS "Authenticated can upload product images" ON storage.objects;
CREATE POLICY "Authenticated can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products');

-- Only authenticated admin can update
DROP POLICY IF EXISTS "Authenticated can update product images" ON storage.objects;
CREATE POLICY "Authenticated can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products');

-- Only authenticated admin can delete
DROP POLICY IF EXISTS "Authenticated can delete product images" ON storage.objects;
CREATE POLICY "Authenticated can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products');
