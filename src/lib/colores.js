// Available color variants for product color selection.
// `hex` is used to render the swatch circle in both CMS and product page.
// `border` is applied when the swatch is light enough to need a visible edge.
export const COLORES_DISPONIBLES = [
  { id: 'blanco', label: 'Blanco', hex: '#f5f2ec', border: true },
  { id: 'negro', label: 'Negro', hex: '#1a1a1a', border: false },
  { id: 'azul', label: 'Azul', hex: '#2b4a7a', border: false },
  { id: 'marron', label: 'Marrón', hex: '#6b4423', border: false },
  { id: 'beige', label: 'Beige', hex: '#d9c9a8', border: true },
  { id: 'gris', label: 'Gris', hex: '#8a8a8a', border: false },
]

export const getColorMeta = (id) =>
  COLORES_DISPONIBLES.find((c) => c.id === id) ?? null

// Normalize raw DB value into a clean array of { id, imagenes } entries.
// Drops entries with unknown ids or empty images.
export const normalizeColores = (raw) => {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((c) => c && typeof c.id === 'string' && getColorMeta(c.id))
    .map((c) => ({
      id: c.id,
      imagenes: Array.isArray(c.imagenes) ? c.imagenes.filter(Boolean) : [],
    }))
    .filter((c) => c.imagenes.length > 0)
}
