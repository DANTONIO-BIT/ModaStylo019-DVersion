import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCartStore } from '@/store/useCartStore'

export default function CheckoutSuccess() {
  const clearCart = useCartStore((s) => s.clearCart)
  const [searchParams] = useSearchParams()
  const paymentStatus = searchParams.get('payment_status')

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
      style={{ background: 'var(--color-base)', minHeight: 'calc(100vh - 200px)' }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'var(--color-accent)' }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-paper)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1
        className="font-serif mb-4"
        style={{ fontSize: '2rem', color: 'var(--color-ink)', letterSpacing: '-0.02em' }}
      >
        ¡Pedido confirmado!
      </h1>

      <p
        className="label-xs mb-8 max-w-md"
        style={{ color: 'var(--color-muted)', letterSpacing: '0.02em' }}
      >
        {paymentStatus === 'paid'
          ? 'Tu pago ha sido procesado correctamente. Recibirás un email de confirmación en breve.'
          : 'Gracias por tu pedido. Te contactaremos pronto para confirmar los detalles.'}
      </p>

      <Link
        to="/"
        className="py-3 px-8 text-sm uppercase transition-colors duration-200"
        style={{
          background: 'var(--color-accent-ink)',
          color: 'var(--color-paper)',
          letterSpacing: '0.12em',
        }}
      >
        Volver a la tienda
      </Link>
    </div>
  )
}