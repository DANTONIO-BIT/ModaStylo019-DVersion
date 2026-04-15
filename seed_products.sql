-- =============================================================================
-- SEED PRODUCTS - Ejecutar en Supabase SQL Editor
-- =============================================================================

INSERT INTO productos (nombre, descripcion, precio, categoria, tallas, precios_talla, precio_oferta, destacado, mas_vendido, activo) VALUES
('Vestido Lino Sevilla', 'Vestido de lino artesanal, corte fluido', 89, 'vestidos', 
 '{"XS":3,"S":5,"M":4,"L":2,"XL":0}', 
 '{"XS":85,"S":89,"M":89,"L":89,"XL":85}', 
 59, true, true, true),

('Blazer Tierra', 'Blazer de punto fino, color tierra', 125, 'blazers', 
 '{"XS":2,"S":4,"M":6,"L":3,"XL":1}', 
 '{"XS":120,"S":125,"M":125,"L":120,"XL":120}', 
 null, true, false, true),

('Falda Midi Crema', 'Falda midi de seda, color crema', 72, 'faldas', 
 '{"XS":0,"S":2,"M":3,"L":1,"XL":0}', 
 '{"XS":70,"S":72,"M":72,"L":70,"XL":70}', 
 49, false, true, true),

('Abrigo Camel Clasico', 'Abrigo de lana merina, corte clasico', 195, 'abrigos', 
 '{"XS":1,"S":3,"M":2,"L":2,"XL":1}', 
 '{"XS":190,"S":195,"M":195,"L":190,"XL":190}', 
 null, true, false, true),

('Pantalon Palazzo', 'Pantalon palazzo de tela fluida', 65, 'pantalones', 
 '{"XS":4,"S":5,"M":3,"L":4,"XL":2}', 
 '{"XS":60,"S":65,"M":65,"L":60,"XL":60}', 
 null, false, true, true),

('Blusa Romantica', 'Blusa de seda con botones', 58, 'blusas', 
 '{"XS":2,"S":3,"M":5,"L":2,"XL":1}', 
 '{"XS":55,"S":58,"M":58,"L":55,"XL":55}', 
 null, false, false, true),

('Vestido Nocturno', 'Vestido largo de terciopelo', 145, 'vestidos', 
 '{"XS":1,"S":2,"M":3,"L":1,"XL":0}', 
 '{"XS":140,"S":145,"M":145,"L":140,"XL":140}', 
 null, true, true, true),

('Falda Plisada Mostaza', 'Falda plisada en tono mostaza', 68, 'faldas', 
 '{"XS":3,"S":4,"M":3,"L":2,"XL":1}', 
 '{"XS":65,"S":68,"M":68,"L":65,"XL":65}', 
 null, false, false, true);

-- Verificar
SELECT nombre, precio, precio_oferta, categoria FROM productos;