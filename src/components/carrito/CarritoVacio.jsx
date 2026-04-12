import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useUIStore } from '@/store/useUIStore'

gsap.registerPlugin(useGSAP)

// Empty state shown inside CartDrawer body when items.length === 0.
// Centered icon + message + CTA to catalog, simple fade-up entry.
export const CarritoVacio = () => {
  const closeCart = useUIStore((s) => s.closeCart)
  const rootRef = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        rootRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.15 }
      )
    },
    { scope: rootRef }
  )

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center"
      style={{ minHeight: '60vh' }}
    >
      {/* Bag outline icon */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      <div className="flex flex-col gap-2">
        <p
          className="font-serif font-light"
          style={{ fontSize: '1.4rem', color: 'var(--color-ink)', letterSpacing: '-0.01em' }}
        >
          Tu carrito está vacío
        </p>
        <p className="label-xs" style={{ color: 'var(--color-muted)' }}>
          Aún no has seleccionado ninguna pieza
        </p>
      </div>

      <Link
        to="/catalogo"
        onClick={closeCart}
        className="label-xs mt-4 px-6 py-3 border transition-colors duration-200"
        style={{
          borderColor: 'var(--color-accent-ink)',
          color: 'var(--color-accent-ink)',
          letterSpacing: '0.15em',
        }}
      >
        Explorar catálogo
      </Link>
    </div>
  )
}
