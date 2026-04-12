# ModaMariaJose — E-commerce

## Proyecto
Tienda de ropa para mujer en Sevilla (C/ Sierpes, Centro Histórico).
La cliente vende principalmente por Instagram. Esta web es su canal digital.
Prototipo de referencia: https://web-e-commerce-ma-jo-d4x1.vercel.app/

## Stack
- Frontend: React 18 + Vite + Tailwind CSS + GSAP (@gsap/react)
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Deploy: Vercel
- Package manager: pnpm

## Negocio
- Nombre marca: ModaMariaJose
- Ubicación: Sevilla, España — C/ Sierpes, Centro Histórico
- WhatsApp negocio: 658 509 332
- Modelo de venta: cliente elige producto/talla → consulta por WhatsApp → dueña confirma manualmente
- Sin pasarela de pago en v1 (preparar arquitectura para futura integración)

## Categorías de productos
Vestidos, Blazers, Abrigos, Faldas, Pantalones, Blusas

## Tallas
XS, S, M, L, XL — con posibilidad de precio diferente por talla

## Páginas del proyecto
- `/` — Home: hero, novedades, más vendidos, newsletter
- `/catalogo` — Grid de productos con filtros
- `/producto/:id` — Detalle con galería, talla, carrito, WhatsApp
- `/contacto` — Formulario, horarios, ubicación
- `/admin` — CMS privado (Supabase Auth)

## Módulos de desarrollo
- M1: Infraestructura (setup, Supabase, Router, Zustand, Layout)
- M2: Catálogo (grid, filtros, búsqueda, ordenamiento)
- M3: Página de Producto (galería, tallas, carrito, WhatsApp CTA)
- M4: Carrito + Checkout WhatsApp
- M5: Home (hero GSAP, secciones animadas, newsletter)
- M6: Admin CMS (CRUD productos, Supabase Storage, gestión stock)
- M7: Contacto (formulario funcional)
- M8: Diseño global y animaciones (GSAP, tipografía extrema, cursor)

## Nivel de diseño esperado
Esta web NO aspira a nivel Kayao Studio, Awwwards SOTD ni producción de agencia top.
El objetivo es una tienda funcional y visualmente cuidada para una clienta real en Sevilla.
- Diseño editorial y limpio, con personalidad — no genérico
- Animaciones útiles y suaves — no espectáculos de WebGL
- Prioridad: que funcione bien, cargue rápido y sea fácil de usar para la dueña y las clientas
- Los agentes de diseño deben aplicar criterio, no exagerar efectos por defecto

## Reglas de este proyecto
- Comentarios de código en inglés
- Arrow functions siempre
- useGSAP() para toda animación, nunca useEffect para GSAP
- Zustand para estado global (carrito, UI)
- Supabase client como singleton en `src/lib/supabase.js`
- Imágenes: Supabase Storage bucket `products`
- Colores y tokens de diseño en `tailwind.config.js`
