-- ============================================================
-- ModaMariaJose — productos table
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS productos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      TEXT NOT NULL,
  descripcion TEXT,
  precio      DECIMAL(10,2) NOT NULL,
  categoria   TEXT NOT NULL CHECK (categoria IN (
                'vestidos','blazers','abrigos','faldas','pantalones','blusas'
              )),
  -- Array of Supabase Storage URLs (bucket: products)
  imagenes    TEXT[] DEFAULT '{}',
  -- Stock per size: { "XS": 5, "S": 3, "M": 0, "L": 2, "XL": 1 }
  -- 0 means sold out for that size
  tallas      JSONB DEFAULT '{"XS":0,"S":0,"M":0,"L":0,"XL":0}',
  destacado   BOOLEAN DEFAULT false,
  mas_vendido BOOLEAN DEFAULT false,
  activo      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security: public read of active products only
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
  ON productos FOR SELECT
  USING (activo = true);

-- Admin full access (authenticated users)
CREATE POLICY "Authenticated users have full access"
  ON productos FOR ALL
  USING (auth.role() = 'authenticated');

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos (categoria);
CREATE INDEX IF NOT EXISTS idx_productos_precio    ON productos (precio);
CREATE INDEX IF NOT EXISTS idx_productos_created   ON productos (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_productos_activo    ON productos (activo);

-- ============================================================
-- Seed data — sample products (optional, for testing)
-- ============================================================

INSERT INTO productos (nombre, descripcion, precio, categoria, tallas, destacado, mas_vendido)
VALUES
  ('Vestido Lino Sevilla',   'Vestido de lino artesanal, corte fluido. Perfecto para el verano sevillano.', 89.00,  'vestidos',   '{"XS":3,"S":5,"M":4,"L":2,"XL":0}', true,  true),
  ('Blazer Tierra',          'Blazer de punto fino, color tierra. Versátil y atemporal.',                   125.00, 'blazers',    '{"XS":2,"S":4,"M":6,"L":3,"XL":1}', true,  false),
  ('Falda Midi Crema',       'Falda midi de seda, color crema. Elegancia natural.',                         72.00,  'faldas',     '{"XS":0,"S":2,"M":3,"L":1,"XL":0}', false, true),
  ('Abrigo Camel Clásico',   'Abrigo de lana merina, corte clásico. Hecho en España.',                     195.00, 'abrigos',    '{"XS":1,"S":3,"M":2,"L":2,"XL":1}', true,  false),
  ('Pantalón Palazzo',       'Pantalón palazzo de tela fluida. Disponible en varios tonos.',                65.00,  'pantalones', '{"XS":4,"S":5,"M":3,"L":4,"XL":2}', false, true),
  ('Blusa Romántica',        'Blusa de seda con detalle de botones nacarados.',                             58.00,  'blusas',     '{"XS":2,"S":3,"M":5,"L":2,"XL":1}', false, false),
  ('Vestido Nocturno',       'Vestido largo de terciopelo para ocasiones especiales.',                      145.00, 'vestidos',   '{"XS":1,"S":2,"M":3,"L":1,"XL":0}', true,  true),
  ('Falda Plisada Mostaza',  'Falda plisada en tono mostaza. Tendencia esta temporada.',                   68.00,  'faldas',     '{"XS":3,"S":4,"M":3,"L":2,"XL":1}', false, false);
