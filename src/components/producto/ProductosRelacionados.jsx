import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ProductCard } from '@/components/catalogo/ProductCard'
import { SkeletonCard } from '@/components/catalogo/SkeletonCard'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Grid of up to 4 related products (same category).
// Reuses ProductCard and SkeletonCard from the catalog.
// Stagger scroll-triggered reveal — same pattern as ProductGrid.
export const ProductosRelacionados = ({ productos = [], loading = false }) => {
  const gridRef = useRef(null)

  // Scroll-triggered stagger reveal when products are ready
  useGSAP(
    () => {
      if (loading || !productos.length) return

      const cards = gridRef.current?.querySelectorAll('[data-related-card]')
      if (!cards?.length) return

      gsap.fromTo(
        cards,
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )
    },
    { scope: gridRef, dependencies: [loading, productos] }
  )

  if (loading) {
    return (
      <div
        ref={gridRef}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={`rel-skeleton-${i}`} />
        ))}
      </div>
    )
  }

  if (!productos.length) return null

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
    >
      {productos.map((producto, i) => (
        <div
          key={producto.id}
          data-related-card
          style={{ willChange: 'transform, opacity' }}
        >
          <ProductCard producto={producto} index={i} />
        </div>
      ))}
    </div>
  )
}
