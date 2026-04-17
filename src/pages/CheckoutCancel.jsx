import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useUIStore } from '@/store/useUIStore'

gsap.registerPlugin(useGSAP)

// Cart is intentionally NOT cleared here — user may want to retry payment.
const CheckoutCancel = () => {
  const openCart = useUIStore((s) => s.openCart)
  const rootRef = useRef(null)

  useGSAP(
    () => {
      gsap.from(rootRef.current.children, {
        opacity: 0,
        y: 24,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
      })
    },
    { scope: rootRef }
  )

  return (
    <section
      className="min-h-[80vh] flex items-center justify-center px-6"
      style={{ background: 'var(--color-base)' }}
    >
      <div
        ref={rootRef}
        className="flex flex-col items-center text-center"
        style={{ maxWidth: '36rem', gap: '1.75rem' }}
      >
        {/* Eyebrow */}
        <span
          className="label-xs"
          style={{ color: 'var(--color-muted)', letterSpacing: '0.3em' }}
        >
          [Cancelado]
        </span>

        {/* Heading */}
        <h1
          className="font-serif font-light"
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            color: 'var(--color-ink)',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
          }}
        >
          Pago cancelado.
        </h1>

        {/* Body */}
        <p
          className="font-sans font-light"
          style={{
            fontSize: '1rem',
            color: 'var(--color-muted)',
            lineHeight: 1.65,
          }}
        >
          No se ha realizado ningún cargo. Tu selección sigue guardada en el carrito
          por si quieres intentarlo de nuevo.
        </p>

        {/* Divider */}
        <div
          style={{
            width: '2rem',
            height: '1px',
            background: 'var(--color-surface)',
            margin: '0.5rem 0',
          }}
        />

        {/* CTAs */}
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={openCart}
            className="label-xs transition-colors"
            style={{ color: 'var(--color-ink)', letterSpacing: '0.2em' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink)')}
          >
            Volver al carrito →
          </button>

          <Link
            to="/catalogo"
            className="label-xs transition-colors"
            style={{ color: 'var(--color-muted)', letterSpacing: '0.2em' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-ink)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            Seguir mirando
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CheckoutCancel
