import { Link } from 'react-router-dom'

export default function CheckoutCancel() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
      style={{ background: 'var(--color-base)', minHeight: 'calc(100vh - 200px)' }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'var(--color-muted)' }}
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>

      <h1
        className="font-serif mb-4"
        style={{ fontSize: '2rem', color: 'var(--color-ink)', letterSpacing: '-0.02em' }}
      >
        Pago cancelado
      </h1>

      <p
        className="label-xs mb-8 max-w-md"
        style={{ color: 'var(--color-muted)', letterSpacing: '0.02em' }}
      >
        No se ha procesado ningún pago. Puedes volver a intentar cuando quieras.
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