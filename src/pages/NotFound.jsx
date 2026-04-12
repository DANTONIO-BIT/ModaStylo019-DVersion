import { Link } from 'react-router-dom'

const NotFound = () => (
  <div
    style={{ minHeight: '100vh' }}
    className="flex flex-col items-center justify-center gap-8"
  >
    <span
      className="font-serif font-semibold text-[var(--color-surface)]"
      style={{ fontSize: 'clamp(6rem, 20vw, 18rem)', lineHeight: 1, letterSpacing: '-0.05em' }}
    >
      404
    </span>
    <p className="label-xs text-[var(--color-muted)]">Página no encontrada</p>
    <Link
      to="/"
      className="font-serif font-light text-[var(--color-accent-ink)] hover:underline"
      style={{ fontSize: '1.1rem' }}
    >
      Volver al inicio
    </Link>
  </div>
)

export default NotFound
