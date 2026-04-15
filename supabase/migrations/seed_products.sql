-- =============================================================================
-- Seed Products -.Insertar productos de prueba en la base de datos
-- Ejecutar en Supabase SQL Editor
-- =============================================================================

INSERT INTO productos (nombre, descripcion, precio, categoria, tallas, precios_talla, precio_oferta, destacado, mas_vendido, activo) VALUES
('Vestido Lino Sevilla', 'Vestido de lino artesanal, corte fluido. Perfecto para el verano sevillano.', 89.00, 'vestidos', 
 '{"XS":3,"S":5,"M":4,"L":2,"XL":0}', 
 '{"XS":85,"S":89,"M":89,"L":89,"XL":85}', 
 59.00, true, true, true),

('Blazer Tierra', 'Blazer de punto fino, color tierra. Versatil y atemporal.', 125.00, 'blazers', 
 '{"XS":2,"S":4,"M":6,"L":3,"XL":1}', 
 '{"XS":120,"S":125,"M":125,"L":120,"XL":120}', 
 NULL, true, false, true),

('Falda Midi Crema', 'Falda midi de seda, color crema. Elegancia natural.', 72.00, 'faldas', 
 '{"XS":0,"S":2,"M":3,"L":1,"XL":0}', 
 '{"XS":70,"S":72,"M":72,"L":70,"XL":70}', 
 49.00, false, true, true),

('Abrigo Camel Clasico', 'Abrigo de lana merina, corte clasico. Hecho en Espania.', 195.00, 'abrigos', 
 '{"XS":1,"S":3,"M":2,"L":2,"XL":1}', 
 '{"XS":190,"S":195,"M":195,"L":190,"XL":190}', 
 NULL, true, false, true),

('Pantalon Palazzo', 'Pantalon palazzo de tela fluida. Disponible en varios tonos.', 65.00, 'pantalones', 
 '{"XS":4,"S":5,"M":3,"L":4,"XL":2}', 
 '{"XS":60,"S":65,"M":65,"L":60,"XL":60}', 
 NULL, false, true, true),

('Blusa Romantica', 'Blusa de seda con detalle de botones nacarados.', 58.00, 'blusas', 
 '{"XS":2,"S":3,"M":5,"L":2,"XL":1}', 
 '{"XS":55,"S":58,"M":58,"L":55,"XL":55}', 
 NULL, false, false, true),

('Vestido Nocturno', 'Vestido largo de terciopelo para ocasiones especiales.', 145.00, 'vestidos', 
 '{"XS":1,"S":2,"M":3,"L":1,"XL":0}', 
 '{"XS":140,"S":145,"M":145,"L":140,"XL":140}', 
 NULL, true, true, true),

('Falda Plisada Mostaza', 'Falda plisada en tono mostaza. Tendencia esta temporada.', 68.00, 'faldas', 
 '{"XS":3,"S":4,"M":3,"L":2,"XL":1}', 
 '{"XS":65,"S":68,"M":68,"L":65,"XL":65}', 
 NULL, false, false, true);

-- Verificar insercion
SELECT nombre, categoria, precio, precio_oferta FROM productos ORDER BY created_at DESC LIMIT 10;