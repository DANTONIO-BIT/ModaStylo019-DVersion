import { useState, useEffect } from 'react'
import { fetchProductos } from '@/services/productos'

/**
 * Custom hook to fetch and manage products with filters.
 * Re-fetches automatically when filters change.
 * Uses a serialized key as the effect dependency so object-literal filtros
 * do not cause infinite re-fetches.
 *
 * @param {Object} filtros - Filter parameters (see fetchProductos)
 * @returns {{ productos: Array, loading: boolean, total: number, error: string|null }}
 */
export const useProductos = (filtros = {}) => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState(null)

  const filtrosKey = JSON.stringify(filtros)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)

      const { data, count, error: err } = await fetchProductos(filtros)

      if (cancelled) return

      if (err) {
        setError('Error cargando productos. Inténtalo de nuevo.')
        setProductos([])
        setTotal(0)
      } else {
        setProductos(data)
        setTotal(count)
      }

      setLoading(false)
    }

    load()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrosKey])

  return { productos, loading, total, error }
}
