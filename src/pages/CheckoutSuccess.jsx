import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCartStore } from '@/store/useCartStore'

gsap.registerPlugin(useGSAP)

const CheckoutSuccess = () => {
  const clearCart = useCartStore((s) => s.clearCart)
  const rootRef = useRef(null)

  // Clear cart once — payment confirmed by Stripe redirect
  useEffect(() => {
    clearCart()
  }, [clearCart])

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
          style={{ color: 'var(--color-accent)', letterSpacing: '0.3em' }}
        >
          [Confirmado]
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
          Pedido recibido.
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
          Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación
          en breve con los detalles de tu pedido.
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

        {/* CTA */}
        <Link
          to="/catalogo"
          className="label-xs transition-colors"
          style={{ color: 'var(--color-ink)', letterSpacing: '0.2em' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink)')}
        >
          Seguir comprando →
        </Link>
      </div>
    </section>
  )
}

export default CheckoutSuccess
