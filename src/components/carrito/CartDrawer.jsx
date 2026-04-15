import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { ItemCarrito } from '@/components/carrito/ItemCarrito'
import { CarritoVacio } from '@/components/carrito/CarritoVacio'
import { formatPrice } from '@/lib/precio'
import { createCheckoutSession } from '@/services/checkout'

gsap.registerPlugin(useGSAP)

const WHATSAPP_NUMBER = '34658509332'

// Slide-in cart sidebar: backdrop + right panel with items, subtotal,
// WhatsApp checkout and clear-cart action. Mounted in Layout.jsx.
export const CartDrawer = () => {
  const items = useCartStore((s) => s.items)
  const total = useCartStore((s) => s.total)
  const totalItems = useCartStore((s) => s.totalItems)
  const clearCart = useCartStore((s) => s.clearCart)
  const buildWhatsAppMessage = useCartStore((s) => s.buildWhatsAppMessage)

  const cartOpen = useUIStore((s) => s.cartOpen)
  const closeCart = useUIStore((s) => s.closeCart)

  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const rootRef = useRef(null)
  const backdropRef = useRef(null)
  const panelRef = useRef(null)
  const bodyRef = useRef(null)

  // Unified open/close animation — single useGSAP, no context conflicts
  useGSAP(
    () => {
      if (!rootRef.current) return

      // Ensure initial state on mount (before animation decides direction)
      if (!rootRef.current.dataset.gsapInit) {
        gsap.set(panelRef.current, { xPercent: 100 })
        gsap.set(backdropRef.current, { opacity: 0 })
        gsap.set(rootRef.current, { pointerEvents: 'none' })
        rootRef.current.dataset.gsapInit = 'true'
      }

      if (cartOpen) {
        gsap.set(rootRef.current, { pointerEvents: 'auto' })

        const tl = gsap.timeline()
        tl.to(backdropRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
        tl.to(panelRef.current, { xPercent: 0, duration: 0.6, ease: 'expo.out' }, 0)

        const itemEls = bodyRef.current?.querySelectorAll('[data-cart-item]')
        if (itemEls?.length) {
          tl.fromTo(
            itemEls,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.05 },
            0.3
          )
        }
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            if (rootRef.current) {
              gsap.set(rootRef.current, { pointerEvents: 'none' })
            }
          },
        })
        tl.to(panelRef.current, { xPercent: 100, duration: 0.4, ease: 'expo.in' }, 0)
        tl.to(backdropRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.05)
      }
    },
    { scope: rootRef, dependencies: [cartOpen, items.length], revertOnUpdate: false }
  )

  // Body scroll lock while drawer is open
  useEffect(() => {
    if (cartOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [cartOpen])

  // Close on Escape
  useEffect(() => {
    if (!cartOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen, closeCart])

  const itemsCount = totalItems()
  const subtotal = total()
  const hasItems = items.length > 0
  const { int: subInt, dec: subDec } = formatPrice(subtotal)

  const whatsappUrl = hasItems
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`
    : '#'

  const handleStripeCheckout = async () => {
    if (!hasItems || checkoutLoading) return
    setCheckoutLoading(true)
    try {
      await createCheckoutSession(items)
    } catch (err) {
      alert(err.message || 'Error al procesar el pago')
      setCheckoutLoading(false)
    }
  }

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50"
      aria-hidden={!cartOpen}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={closeCart}
        className="absolute inset-0"
        style={{ background: 'rgba(10, 37, 64, 0.45)' }}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        className="absolute right-0 top-0 h-full flex flex-col"
        style={{
          width: 'min(100%, 440px)',
          background: 'var(--color-base)',
          boxShadow: '-20px 0 60px rgba(10, 37, 64, 0.12)',
        }}
        role="dialog"
        aria-label="Carrito de compra"
      >
        {/* Header */}
        <header
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'var(--color-surface)' }}
        >
          <div className="flex items-baseline gap-2">
            <span
              className="font-serif font-light"
              style={{ fontSize: '1.4rem', color: 'var(--color-ink)', letterSpacing: '-0.01em' }}
            >
              Tu selección
            </span>
            <span className="label-xs" style={{ color: 'var(--color-muted)' }}>
              [
              <span
                className="tabular-nums"
                style={{ color: 'var(--color-accent-ink)', fontWeight: 600 }}
              >
                {String(itemsCount).padStart(2, '0')}
              </span>
              ]
            </span>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex items-center gap-2 label-xs transition-colors duration-200"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            <span>Cerrar</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Body */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-y-auto px-6"
          style={{ overscrollBehavior: 'contain' }}
        >
          {hasItems ? (
            items.map((item) => (
              <div key={`${item.id}-${item.talla}`} data-cart-item>
                <ItemCarrito item={item} />
              </div>
            ))
          ) : (
            <CarritoVacio />
          )}
        </div>

        {/* Footer (only if cart has items) */}
        {hasItems && (
          <footer
            className="px-6 py-5 border-t flex flex-col gap-4"
            style={{ borderColor: 'var(--color-surface)', background: 'var(--color-base)' }}
          >
            {/* Subtotal row */}
            <div className="flex items-baseline justify-between">
              <span className="label-xs" style={{ color: 'var(--color-muted)' }}>
                Subtotal
              </span>
              <p className="font-serif flex items-start" style={{ color: 'var(--color-ink)' }}>
                <span style={{ fontSize: '0.7rem', lineHeight: 1, marginTop: '0.5rem', marginRight: '0.1rem' }}>
                  &euro;
                </span>
                <span
                  style={{
                    fontSize: '1.9rem',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    fontWeight: 600,
                  }}
                >
                  {subInt}
                  <span style={{ fontSize: '0.95rem', marginLeft: '0.15rem', fontWeight: 400 }}>
                    .{subDec}
                  </span>
                </span>
              </p>
            </div>

            <p
              className="label-xs leading-relaxed"
              style={{ color: 'var(--color-muted)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '0.72rem' }}
            >
              Envío, disponibilidad final y ajustes se confirman directamente por WhatsApp.
            </p>

            {/* Stripe Checkout CTA */}
            <button
              type="button"
              onClick={handleStripeCheckout}
              disabled={checkoutLoading}
              className="w-full py-4 text-center font-sans text-sm uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 disabled:opacity-60"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-paper)',
                letterSpacing: '0.12em',
              }}
            >
              {checkoutLoading ? 'Procesando...' : 'Pagar con tarjeta'}
            </button>

            {/* Checkout CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                if (!hasItems) e.preventDefault()
              }}
              className="w-full py-4 text-center font-sans text-sm uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1"
              style={{
                background: 'var(--color-accent-ink)',
                color: 'var(--color-paper)',
                letterSpacing: '0.12em',
              }}
            >
              Finalizar por WhatsApp
            </a>

            {/* Clear cart */}
            <button
              type="button"
              onClick={clearCart}
              className="label-xs self-center transition-colors duration-200"
              style={{ color: 'var(--color-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted)')}
            >
              Vaciar carrito
            </button>
          </footer>
        )}
      </aside>
    </div>
  )
}
