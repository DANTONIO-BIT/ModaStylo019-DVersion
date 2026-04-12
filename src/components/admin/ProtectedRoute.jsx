import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

/**
 * Route guard for /admin/*.
 * While the initial session check is in flight shows a neutral loader.
 * If no session, redirects to /admin/login preserving intended location.
 */
export const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div
        className="flex items-center justify-center bg-[var(--color-base)]"
        style={{ minHeight: '100vh' }}
      >
        <span
          className="font-sans text-[var(--color-muted)] label-xs"
          style={{ letterSpacing: '0.25em' }}
        >
          Cargando…
        </span>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
