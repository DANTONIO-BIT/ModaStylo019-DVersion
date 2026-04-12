import { useState, useEffect } from 'react'
import { fetchProductoById, fetchProductosRelacionados } from '@/services/productos'

// Hook that loads a single product and its related products (same category)
export const useProducto = (id) => {
  const [producto, setProducto] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setNotFound(false)
      setError(null)
      setProducto(null)
      setRelacionados([])

      // Fetch product first — we need the category to query related products
      const { data: prod, error: prodErr } = await fetchProductoById(id)

      if (cancelled) return

      // PGRST116 = no rows returned by .single()
      if (prodErr?.code === 'PGRST116' || (!prodErr && !prod)) {
        setNotFound(true)
        setLoading(false)
        return
      }

      if (prodErr) {
        setError('No se pudo cargar el producto.')
        setLoading(false)
        return
      }

      setProducto(prod)

      // Fetch related products using the resolved category
      const { data: rel } = await fetchProductosRelacionados(prod.categoria, prod.id, 4)

      if (!cancelled) {
        setRelacionados(rel)
        setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id])

  return { producto, relacionados, loading, notFound, error }
}
