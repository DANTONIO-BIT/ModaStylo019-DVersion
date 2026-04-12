import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { to: '/admin', label: 'Productos', end: true },
  { to: '/admin/productos/nuevo', label: 'Nuevo producto', end: false },
]

export const AdminLayout = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div
      className="flex min-h-screen bg-[var(--color-base)] text-[var(--color-ink)]"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Sidebar */}
      <aside
        className="sticky top-0 hidden h-screen flex-col border-r border-[var(--color-surface)] bg-[var(--color-paper)] md:flex"
        style={{ width: '18rem', padding: '2.5rem 1.75rem' }}
      >
        <div className="mb-14">
          <span
            className="label-xs text-[var(--color-accent)] block"
            style={{ letterSpacing: '0.3em' }}
          >
            ModaMariaJose
          </span>
          <h2
            className="font-serif text-[var(--color-ink)]"
            style={{
              fontSize: '1.75rem',
              fontWeight: 300,
              letterSpacing: '-0.01em',
              marginTop: '0.4rem',
              lineHeight: 1,
            }}
          >
            Panel admin
          </h2>
        </div>

        <nav className="flex flex-col" style={{ gap: '0.25rem' }}>
          <span
            className="label-xs text-[var(--color-muted)]"
            style={{ marginBottom: '0.75rem', letterSpacing: '0.25em' }}
          >
            Gestión
          </span>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `font-sans transition-colors ${
                  isActive
                    ? 'text-[var(--color-ink)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                }`
              }
              style={({ isActive }) => ({
                fontSize: '0.88rem',
                padding: '0.7rem 0',
                borderLeft: isActive
                  ? '2px solid var(--color-accent)'
                  : '2px solid transparent',
                paddingLeft: '0.85rem',
                letterSpacing: '0.02em',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col" style={{ gap: '0.75rem' }}>
          <div
            className="border-t border-[var(--color-surface)]"
            style={{ paddingTop: '1.25rem' }}
          >
            <span
              className="label-xs text-[var(--color-muted)] block"
              style={{ letterSpacing: '0.2em', marginBottom: '0.35rem' }}
            >
              Sesión
            </span>
            <span
              className="font-sans text-[var(--color-ink)]"
              style={{
                fontSize: '0.8rem',
                wordBreak: 'break-all',
                display: 'block',
              }}
            >
              {user?.email ?? '—'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full bg-[var(--color-ink)] text-[var(--color-paper)] transition-opacity hover:opacity-85"
            style={{
              padding: '0.85rem 1rem',
              fontSize: '0.72rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <header
        className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-[var(--color-surface)] bg-[var(--color-paper)] md:hidden"
        style={{ padding: '1rem 1.25rem' }}
      >
        <span
          className="font-serif"
          style={{
            fontSize: '1.1rem',
            fontWeight: 400,
            letterSpacing: '-0.01em',
          }}
        >
          Admin
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          className="label-xs text-[var(--color-muted)]"
          style={{ letterSpacing: '0.22em' }}
        >
          Salir
        </button>
      </header>

      {/* Main */}
      <main
        className="flex-1"
        style={{
          padding: 'clamp(1.5rem, 4vw, 3.5rem)',
          paddingTop: 'clamp(4.5rem, 6vw, 3.5rem)',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
