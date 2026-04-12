import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  fetchProductoAdmin,
  createProducto,
  updateProducto,
} from '@/services/productos'
import { ImageUploader } from '@/components/admin/ImageUploader'

const CATEGORIAS = [
  'vestidos',
  'blazers',
  'abrigos',
  'faldas',
  'pantalones',
  'blusas',
]

const TALLAS = ['XS', 'S', 'M', 'L', 'XL']

const emptyForm = () => ({
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: 'vestidos',
  tallas: { XS: 0, S: 0, M: 0, L: 0, XL: 0 },
  imagenes: [],
  destacado: false,
  mas_vendido: false,
  activo: true,
})

const parseStock = (value) => {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.floor(n)
}

const ProductoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  // Load existing product when editing
  useEffect(() => {
    if (!isEdit) return
    let cancelled = false

    const load = async () => {
      setLoading(true)
      const { data, error: err } = await fetchProductoAdmin(id)
      if (cancelled) return
      if (err || !data) {
        setError('No se pudo cargar el producto.')
        setLoading(false)
        return
      }
      setForm({
        nombre: data.nombre ?? '',
        descripcion: data.descripcion ?? '',
        precio: String(data.precio ?? ''),
        categoria: data.categoria ?? 'vestidos',
        tallas: {
          XS: Number(data.tallas?.XS) || 0,
          S: Number(data.tallas?.S) || 0,
          M: Number(data.tallas?.M) || 0,
          L: Number(data.tallas?.L) || 0,
          XL: Number(data.tallas?.XL) || 0,
        },
        imagenes: Array.isArray(data.imagenes) ? data.imagenes : [],
        destacado: !!data.destacado,
        mas_vendido: !!data.mas_vendido,
        activo: data.activo ?? true,
      })
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, isEdit])

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const updateTalla = (talla, value) => {
    setForm((prev) => ({
      ...prev,
      tallas: { ...prev.tallas, [talla]: parseStock(value) },
    }))
  }

  const validate = () => {
    const errors = {}
    if (!form.nombre.trim()) errors.nombre = 'Requerido'
    const precio = Number(form.precio)
    if (!Number.isFinite(precio) || precio <= 0) errors.precio = 'Precio inválido'
    if (!CATEGORIAS.includes(form.categoria)) errors.categoria = 'Categoría inválida'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    if (!validate()) return

    setError(null)
    setSubmitting(true)

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      precio: Number(form.precio),
      categoria: form.categoria,
      tallas: form.tallas,
      imagenes: form.imagenes,
      destacado: form.destacado,
      mas_vendido: form.mas_vendido,
      activo: form.activo,
    }

    const { error: err } = isEdit
      ? await updateProducto(id, payload)
      : await createProducto(payload)

    setSubmitting(false)

    if (err) {
      setError(err.message || 'No se pudo guardar. Inténtalo de nuevo.')
      return
    }

    navigate('/admin', { replace: true })
  }

  if (loading) {
    return (
      <div
        className="font-sans text-[var(--color-muted)]"
        style={{ fontSize: '0.85rem' }}
      >
        Cargando producto…
      </div>
    )
  }

  return (
    <div className="flex flex-col" style={{ gap: '2.5rem' }}>
      {/* Header */}
      <div
        className="flex flex-wrap items-end justify-between"
        style={{ gap: '1.5rem' }}
      >
        <div>
          <Link
            to="/admin"
            className="label-xs text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            style={{ letterSpacing: '0.25em' }}
          >
            ← Volver a productos
          </Link>
          <h1
            className="font-serif text-[var(--color-ink)]"
            style={{
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              marginTop: '0.65rem',
            }}
          >
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col"
        style={{ gap: '2.5rem' }}
      >
        {/* Basic info */}
        <Section title="Información básica">
          <div
            className="grid"
            style={{
              gridTemplateColumns: '1fr',
              gap: '1.5rem',
            }}
          >
            <Field
              label="Nombre"
              required
              error={fieldErrors.nombre}
            >
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => updateField('nombre', e.target.value)}
                placeholder="Vestido Lino Sevilla"
                className="w-full bg-[var(--color-paper)] font-sans text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                style={{
                  border: '1px solid var(--color-surface)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                }}
              />
            </Field>

            <Field label="Descripción">
              <textarea
                rows={4}
                value={form.descripcion}
                onChange={(e) => updateField('descripcion', e.target.value)}
                placeholder="Vestido de lino artesanal, corte fluido…"
                className="w-full bg-[var(--color-paper)] font-sans text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                style={{
                  border: '1px solid var(--color-surface)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  minHeight: '6rem',
                  lineHeight: 1.55,
                }}
              />
            </Field>

            <div
              className="grid"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))',
                gap: '1.5rem',
              }}
            >
              <Field
                label="Precio (€)"
                required
                error={fieldErrors.precio}
              >
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precio}
                  onChange={(e) => updateField('precio', e.target.value)}
                  placeholder="89.00"
                  className="w-full bg-[var(--color-paper)] font-sans text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  style={{
                    border: '1px solid var(--color-surface)',
                    padding: '0.85rem 1rem',
                    fontSize: '0.95rem',
                  }}
                />
              </Field>

              <Field
                label="Categoría"
                required
                error={fieldErrors.categoria}
              >
                <select
                  value={form.categoria}
                  onChange={(e) => updateField('categoria', e.target.value)}
                  className="w-full bg-[var(--color-paper)] font-sans text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
                  style={{
                    border: '1px solid var(--color-surface)',
                    padding: '0.85rem 1rem',
                    fontSize: '0.95rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </Section>

        {/* Stock by talla */}
        <Section
          title="Stock por talla"
          hint="Unidades disponibles. 0 = agotada esa talla."
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(7rem, 1fr))',
              gap: '1rem',
            }}
          >
            {TALLAS.map((talla) => (
              <Field key={talla} label={talla}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.tallas[talla]}
                  onChange={(e) => updateTalla(talla, e.target.value)}
                  className="w-full bg-[var(--color-paper)] font-serif text-[var(--color-ink)] text-center outline-none focus:border-[var(--color-accent)]"
                  style={{
                    border: '1px solid var(--color-surface)',
                    padding: '1rem 0.75rem',
                    fontSize: '1.4rem',
                    fontWeight: 300,
                  }}
                />
              </Field>
            ))}
          </div>
        </Section>

        {/* Flags */}
        <Section title="Visibilidad y destacados">
          <div className="flex flex-col" style={{ gap: '1rem' }}>
            <FlagRow
              label="Novedad"
              hint="Aparece en el carrusel de novedades del home"
              checked={form.destacado}
              onChange={(v) => updateField('destacado', v)}
            />
            <FlagRow
              label="Más vendido"
              hint="Aparece en la sección de más vendidos del home"
              checked={form.mas_vendido}
              onChange={(v) => updateField('mas_vendido', v)}
            />
            <FlagRow
              label="Visible en la tienda"
              hint="Desactívalo para ocultar sin borrarlo"
              checked={form.activo}
              onChange={(v) => updateField('activo', v)}
            />
          </div>
        </Section>

        {/* Images */}
        <Section
          title="Imágenes"
          hint="Arrastra fotos o selecciónalas. La primera será la principal."
        >
          <ImageUploader
            value={form.imagenes}
            onChange={(next) => updateField('imagenes', next)}
          />
        </Section>

        {error && (
          <p
            className="font-sans text-red-600"
            style={{ fontSize: '0.85rem' }}
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div
          className="flex items-center justify-end border-t border-[var(--color-surface)]"
          style={{ gap: '0.75rem', paddingTop: '2rem' }}
        >
          <Link
            to="/admin"
            className="font-sans text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              padding: '0.95rem 1.25rem',
            }}
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[var(--color-ink)] font-sans text-[var(--color-paper)] transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              padding: '0.95rem 1.75rem',
            }}
          >
            {submitting
              ? 'Guardando…'
              : isEdit
                ? 'Guardar cambios'
                : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Presentational helpers ───

const Section = ({ title, hint, children }) => (
  <section
    className="bg-[var(--color-paper)]"
    style={{
      border: '1px solid var(--color-surface)',
      padding: 'clamp(1.5rem, 3vw, 2.25rem)',
    }}
  >
    <div style={{ marginBottom: '1.75rem' }}>
      <h2
        className="font-serif text-[var(--color-ink)]"
        style={{
          fontSize: '1.25rem',
          fontWeight: 400,
          letterSpacing: '-0.005em',
        }}
      >
        {title}
      </h2>
      {hint && (
        <p
          className="font-sans text-[var(--color-muted)]"
          style={{ fontSize: '0.78rem', marginTop: '0.35rem' }}
        >
          {hint}
        </p>
      )}
    </div>
    {children}
  </section>
)

const Field = ({ label, required, error, children }) => (
  <label className="flex flex-col" style={{ gap: '0.5rem' }}>
    <span
      className="label-xs text-[var(--color-muted)]"
      style={{ letterSpacing: '0.22em' }}
    >
      {label}
      {required && (
        <span className="text-[var(--color-accent)]" style={{ marginLeft: '0.35rem' }}>
          ·
        </span>
      )}
    </span>
    {children}
    {error && (
      <span
        className="font-sans text-red-600"
        style={{ fontSize: '0.72rem', letterSpacing: '0.02em' }}
      >
        {error}
      </span>
    )}
  </label>
)

const FlagRow = ({ label, hint, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex items-center justify-between bg-[var(--color-base)] text-left transition-colors hover:bg-[var(--color-surface)]"
    style={{
      border: '1px solid var(--color-surface)',
      padding: '1rem 1.25rem',
      gap: '1rem',
    }}
  >
    <div style={{ minWidth: 0 }}>
      <span
        className="font-serif text-[var(--color-ink)] block"
        style={{ fontSize: '1.05rem', fontWeight: 400 }}
      >
        {label}
      </span>
      <span
        className="font-sans text-[var(--color-muted)] block"
        style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}
      >
        {hint}
      </span>
    </div>
    <span
      className="font-sans"
      style={{
        fontSize: '0.65rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        padding: '0.55rem 0.85rem',
        border: checked
          ? '1px solid var(--color-accent)'
          : '1px solid var(--color-muted)',
        backgroundColor: checked ? 'var(--color-accent)' : 'transparent',
        color: checked ? 'var(--color-paper)' : 'var(--color-muted)',
        flexShrink: 0,
      }}
    >
      {checked ? 'Sí' : 'No'}
    </span>
  </button>
)

export default ProductoForm
