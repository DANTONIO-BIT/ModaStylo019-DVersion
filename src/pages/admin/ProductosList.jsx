import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchProductosAdmin,
  updateProducto,
  deleteProducto,
} from '@/services/productos'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'

const CATEGORIAS = [
  { value: '', label: 'Todas' },
  { value: 'vestidos', label: 'Vestidos' },
  { value: 'blazers', label: 'Blazers' },
  { value: 'abrigos', label: 'Abrigos' },
  { value: 'faldas', label: 'Faldas' },
  { value: 'pantalones', label: 'Pantalones' },
  { value: 'blusas', label: 'Blusas' },
  { value: 'curvy', label: 'Curvy' },
]

const TALLAS = ['XS', 'S', 'M', 'L', 'XL']

const sumStock = (tallas) =>
  TALLAS.reduce((acc, t) => acc + (Number(tallas?.[t]) || 0), 0)

const formatPrecio = (n) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(Number(n) || 0)

const ProductosList = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')

  const [confirmTarget, setConfirmTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadProductos = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await fetchProductosAdmin({
      categoria: categoria || null,
      busqueda: busqueda || null,
    })
    if (err) setError('Error cargando productos. Revisa tu conexión.')
    setProductos(data)
    setLoading(false)
  }, [categoria, busqueda])

  useEffect(() => {
    loadProductos()
  }, [loadProductos])

  // Optimistic toggle for boolean fields
  const handleToggle = async (producto, field) => {
    const previous = productos
    const nextValue = !producto[field]
    setProductos((prev) =>
      prev.map((p) => (p.id === producto.id ? { ...p, [field]: nextValue } : p)),
    )
    const { error: err } = await updateProducto(producto.id, {
      [field]: nextValue,
    })
    if (err) {
      setProductos(previous)
      setError('No se pudo actualizar. Inténtalo otra vez.')
    }
  }

  const handleDelete = async () => {
    if (!confirmTarget) return
    setDeleting(true)
    const { error: err } = await deleteProducto(confirmTarget.id)
    setDeleting(false)
    if (err) {
      setError('No se pudo eliminar el producto.')
      return
    }
    setProductos((prev) => prev.filter((p) => p.id !== confirmTarget.id))
    setConfirmTarget(null)
  }

  const stats = useMemo(
    () => ({
      total: productos.length,
      activos: productos.filter((p) => p.activo).length,
      destacados: productos.filter((p) => p.destacado).length,
      masVendidos: productos.filter((p) => p.mas_vendido).length,
    }),
    [productos],
  )

  return (
    <div className="flex flex-col" style={{ gap: '2.5rem' }}>
      {/* Header */}
      <div
        className="flex flex-wrap items-end justify-between"
        style={{ gap: '1.5rem' }}
      >
        <div>
          <span
            className="label-xs text-[var(--color-muted)]"
            style={{ letterSpacing: '0.25em' }}
          >
            Catálogo
          </span>
          <h1
            className="font-serif text-[var(--color-ink)]"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              marginTop: '0.5rem',
            }}
          >
            Productos
          </h1>
        </div>

        <Link
          to="/admin/productos/nuevo"
          className="bg-[var(--color-ink)] font-sans text-[var(--color-paper)] transition-opacity hover:opacity-85"
          style={{
            padding: '0.95rem 1.5rem',
            fontSize: '0.72rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          + Nuevo producto
        </Link>
      </div>

      {/* Stats row */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
          gap: '1rem',
        }}
      >
        {[
          { label: 'Total', value: stats.total },
          { label: 'Activos', value: stats.activos },
          { label: 'Novedades', value: stats.destacados },
          { label: 'Más vendidos', value: stats.masVendidos },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--color-paper)]"
            style={{
              padding: '1.25rem 1.5rem',
              border: '1px solid var(--color-surface)',
            }}
          >
            <span
              className="label-xs text-[var(--color-muted)] block"
              style={{ letterSpacing: '0.25em' }}
            >
              {stat.label}
            </span>
            <span
              className="font-serif text-[var(--color-ink)] block"
              style={{
                fontSize: '2rem',
                fontWeight: 300,
                letterSpacing: '-0.01em',
                marginTop: '0.25rem',
                lineHeight: 1,
              }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center"
        style={{ gap: '1rem' }}
      >
        <input
          type="text"
          placeholder="Buscar por nombre o descripción…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 bg-[var(--color-paper)] font-sans text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
          style={{
            border: '1px solid var(--color-surface)',
            padding: '0.85rem 1rem',
            fontSize: '0.9rem',
            minWidth: '14rem',
          }}
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="bg-[var(--color-paper)] font-sans text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
          style={{
            border: '1px solid var(--color-surface)',
            padding: '0.85rem 1rem',
            fontSize: '0.9rem',
          }}
        >
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p
          className="font-sans text-red-600"
          style={{ fontSize: '0.85rem' }}
        >
          {error}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div
          className="font-sans text-[var(--color-muted)]"
          style={{ fontSize: '0.85rem' }}
        >
          Cargando productos…
        </div>
      ) : productos.length === 0 ? (
        <div
          className="bg-[var(--color-paper)] text-center"
          style={{
            border: '1px solid var(--color-surface)',
            padding: '4rem 2rem',
          }}
        >
          <p
            className="font-serif text-[var(--color-muted)]"
            style={{ fontSize: '1.25rem', fontWeight: 300 }}
          >
            No hay productos todavía.
          </p>
        </div>
      ) : (
        <div
          className="bg-[var(--color-paper)]"
          style={{ border: '1px solid var(--color-surface)' }}
        >
          {/* Table head (desktop) */}
          <div
            className="hidden border-b border-[var(--color-surface)] md:grid"
            style={{
              gridTemplateColumns:
                '5.5rem minmax(0, 2.4fr) 1fr 0.9fr 0.9fr 1.4fr 1.2fr',
              padding: '1rem 1.25rem',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {['', 'Producto', 'Categoría', 'Precio', 'Stock', 'Estado', ''].map(
              (label, i) => (
                <span
                  key={i}
                  className="label-xs text-[var(--color-muted)]"
                  style={{ letterSpacing: '0.22em' }}
                >
                  {label}
                </span>
              ),
            )}
          </div>

          {productos.map((p) => (
            <div
              key={p.id}
              className="border-b border-[var(--color-surface)] last:border-b-0 md:grid md:items-center"
              style={{
                gridTemplateColumns:
                  '5.5rem minmax(0, 2.4fr) 1fr 0.9fr 0.9fr 1.4fr 1.2fr',
                padding: '1.25rem',
                gap: '1rem',
              }}
            >
              {/* Thumbnail */}
              <div
                className="bg-[var(--color-surface)]"
                style={{
                  width: '4.5rem',
                  height: '5.5rem',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <img
                  src={p.imagenes?.[0]}
                  alt={p.nombre}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Name + description */}
              <div style={{ minWidth: 0 }}>
                <span
                  className="font-serif text-[var(--color-ink)] block"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  {p.nombre}
                </span>
                <span
                  className="font-sans text-[var(--color-muted)] block overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    fontSize: '0.78rem',
                    marginTop: '0.25rem',
                  }}
                >
                  {p.descripcion}
                </span>
              </div>

              {/* Category */}
              <span
                className="font-sans text-[var(--color-muted)]"
                style={{
                  fontSize: '0.78rem',
                  textTransform: 'capitalize',
                  letterSpacing: '0.02em',
                }}
              >
                {p.categoria}
              </span>

              {/* Price */}
              <div className="flex flex-col">
                {p.precio_oferta != null && p.precio_oferta < p.precio && (
                  <span
                    className="font-serif line-through"
                    style={{ fontSize: '0.78rem', fontWeight: 400, color: '#dc2626' }}
                  >
                    {formatPrecio(p.precio)}
                  </span>
                )}
                <span
                  className="font-serif text-[var(--color-ink)]"
                  style={{ fontSize: '1rem', fontWeight: 400 }}
                >
                  {formatPrecio(
                    p.precio_oferta != null && p.precio_oferta < p.precio
                      ? p.precio_oferta
                      : p.precio
                  )}
                </span>
              </div>

              {/* Stock total */}
              <span
                className="font-sans text-[var(--color-ink)]"
                style={{ fontSize: '0.85rem' }}
              >
                {sumStock(p.tallas)}
              </span>

              {/* Toggles */}
              <div
                className="flex flex-wrap items-center"
                style={{ gap: '0.5rem' }}
              >
                <Toggle
                  label="Nov"
                  active={p.destacado}
                  onClick={() => handleToggle(p, 'destacado')}
                  title="Marcar como novedad"
                />
                <Toggle
                  label="Top"
                  active={p.mas_vendido}
                  onClick={() => handleToggle(p, 'mas_vendido')}
                  title="Más vendido"
                />
                <Toggle
                  label="On"
                  active={p.activo}
                  onClick={() => handleToggle(p, 'activo')}
                  title="Visible en la tienda"
                />
              </div>

              {/* Actions */}
              <div
                className="flex items-center justify-end"
                style={{ gap: '0.5rem' }}
              >
                <Link
                  to={`/admin/productos/${p.id}`}
                  className="font-sans text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    padding: '0.55rem 0.85rem',
                    border: '1px solid var(--color-surface)',
                  }}
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirmTarget(p)}
                  className="font-sans text-red-600 hover:text-red-700"
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    padding: '0.55rem 0.85rem',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                  }}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmTarget}
        title="Eliminar producto"
        message={
          confirmTarget
            ? `"${confirmTarget.nombre}" se eliminará definitivamente del catálogo. Esta acción no se puede deshacer.`
            : ''
        }
        loading={deleting}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

// Small inline pill toggle for boolean flags
const Toggle = ({ label, active, onClick, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="font-sans transition-colors"
    style={{
      fontSize: '0.65rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      padding: '0.45rem 0.65rem',
      border: active
        ? '1px solid var(--color-accent)'
        : '1px solid var(--color-surface)',
      backgroundColor: active ? 'var(--color-accent)' : 'transparent',
      color: active ? 'var(--color-paper)' : 'var(--color-muted)',
    }}
  >
    {label}
  </button>
)

export default ProductosList
