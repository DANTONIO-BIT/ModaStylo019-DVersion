-- ============================================================
-- ModaMariaJose - Consolidated Migrations
-- Execute all in one go in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 001: productos table
-- ============================================================

CREATE TABLE IF NOT EXISTS productos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  precio      DECIMAL(10,2) NOT NULL,
  categoria   TEXT NOT NULL CHECK (categoria IN (
                'vestidos','blazers','abrigos','faldas','pantalones','blusas','curvy'
              )),
  imagenes    TEXT[] DEFAULT '{}',
  tallas      JSONB DEFAULT '{"XS":0,"S":0,"M":0,"L":0,"XL":0}',
  precio_oferta DECIMAL(10,2) DEFAULT NULL,
  precios_talla JSONB DEFAULT NULL,
  destacado   BOOLEAN DEFAULT false,
  mas_vendido BOOLEAN DEFAULT false,
  activo      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
  ON productos FOR SELECT
  USING (activo = true);

CREATE POLICY "Authenticated users have full access"
  ON productos FOR ALL
  USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos (categoria);
CREATE INDEX IF NOT EXISTS idx_productos_precio    ON productos (precio);
CREATE INDEX IF NOT EXISTS idx_productos_created   ON productos (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_productos_activo    ON productos (activo);

-- Seed data
INSERT INTO productos (nombre, descripcion, precio, categoria, tallas, destacado, mas_vendido, precio_oferta)
VALUES
  ('Vestido Lino Sevilla',   'Vestido de lino artesanal, corte fluido. Perfecto para el verano sevillano.', 89.00,  'vestidos',   '{"XS":3,"S":5,"M":4,"L":2,"XL":0}', true,  true, 59.00),
  ('Blazer Tierra',          'Blazer de punto fino, color tierra. Versátil y atemporal.',                   125.00, 'blazers',    '{"XS":2,"S":4,"M":6,"L":3,"XL":1}', true,  false, NULL),
  ('Falda Midi Crema',       'Falda midi de seda, color crema. Elegancia natural.',                         72.00,  'faldas',     '{"XS":0,"S":2,"M":3,"L":1,"XL":0}', false, true, 49.00),
  ('Abrigo Camel Clásico',   'Abrigo de lana merina, corte clásico. Hecho en España.',                     195.00, 'abrigos',    '{"XS":1,"S":3,"M":2,"L":2,"XL":1}', true,  false, NULL),
  ('Pantalón Palazzo',       'Pantalón palazzo de tela fluida. Disponible en varios tonos.',                65.00, 'pantalones', '{"XS":4,"S":5,"M":3,"L":4,"XL":2}', false, true, NULL),
  ('Blusa Romántica',        'Blusa de seda con detalle de botones nacarados.',                             58.00, 'blusas',     '{"XS":2,"S":3,"M":5,"L":2,"XL":1}', false, false, NULL),
  ('Vestido Nocturno',       'Vestido largo de terciopelo para ocasiones especiales.',                      145.00, 'vestidos',   '{"XS":1,"S":2,"M":3,"L":1,"XL":0}', true,  true, NULL),
  ('Falda Plisada Mostaza',  'Falda plisada en tono mostaza. Tendencia esta temporada.',                   68.00,  'faldas',     '{"XS":3,"S":4,"M":3,"L":2,"XL":1}', false, false, NULL);

-- ============================================================
-- 002: email_subscribers table
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

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON email_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read subscribers"
  ON email_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- 003: site_settings table
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true);

INSERT INTO site_settings (key, value)
VALUES ('hero_image', '{"url": null}')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- DONE! Database ready.
-- Next steps:
-- 1. Create Storage bucket "products" (public) in Supabase Dashboard
-- 2. Configure .env with Supabase credentials
-- 3. Push to GitHub
-- 4. Run pnpm install && pnpm dev locally
-- ============================================================