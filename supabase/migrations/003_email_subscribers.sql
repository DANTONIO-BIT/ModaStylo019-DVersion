-- ============================================================
-- ModaMariaJose — email_subscribers table (M7)
-- Captures email + optional nombre from contact page and footer.
-- Run this in Supabase Dashboard > SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS email_subscribers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  nombre     TEXT,
  source     TEXT NOT NULL DEFAULT 'contact'
             CHECK (source IN ('contact', 'footer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_created_at
  ON email_subscribers (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_source
  ON email_subscribers (source);

-- Row Level Security
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Public can insert (anonymous form submissions)
CREATE POLICY "Anyone can subscribe"
  ON email_subscribers FOR INSERT
  WITH CHECK (true);

-- Only authenticated users (admin) can read the list
CREATE POLICY "Authenticated users can read subscribers"
  ON email_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');
