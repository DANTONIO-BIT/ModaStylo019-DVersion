-- ============================================================
-- ModaMariaJose — site_settings table (key-value config)
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: public read, authenticated write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true);

-- Seed: hero_image with null url (falls back to placeholder)
INSERT INTO site_settings (key, value)
VALUES ('hero_image', '{"url": null}')
ON CONFLICT (key) DO NOTHING;
