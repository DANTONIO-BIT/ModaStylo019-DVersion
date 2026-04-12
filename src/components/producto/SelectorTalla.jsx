import { useRef } from 'react'
import gsap from 'gsap'

// Same order used in ProductCard for consistency across the project
const TALLA_ORDER = ['XS', 'S', 'M', 'L', 'XL']

// Size selector with per-talla stock validation.
// Disabled state (stock = 0): strikethrough + stone color + not-allowed cursor.
// Selected state: noir background + creme text.
// GSAP scale bump on selection for tactile feedback.
export const SelectorTalla = ({ tallas = {}, seleccionada = null, onChange }) => {
  // Array of refs — one per button — for targeted GSAP scale bumps
  const btnRefs = useRef([])

  const handleSelect = (talla, idx) => {
    const stock = tallas?.[talla] ?? 0
    if (stock === 0) return

    onChange?.(talla)

    // Scale bump feedback on the selected button
    const btn = btnRefs.current[idx]
    if (btn) {
      gsap.fromTo(
        btn,
        { scale: 0.88 },
        { scale: 1, duration: 0.45, ease: 'back.out(2.5)' }
      )
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {TALLA_ORDER.map((talla, idx) => {
        const stock = tallas?.[talla] ?? 0
        const disponible = stock > 0
        const activa = seleccionada === talla

        return (
          <button
            key={talla}
            ref={(el) => (btnRefs.current[idx] = el)}
            onClick={() => handleSelect(talla, idx)}
            disabled={!disponible}
            aria-pressed={activa}
            aria-label={`Talla ${talla}${!disponible ? ' — agotada' : ''}`}
            className="label-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]"
            style={{
              width: '2.75rem',
              height: '2.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: activa
                ? '1px solid var(--color-ink)'
                : '1px solid var(--color-surface)',
              background: activa ? 'var(--color-ink)' : 'transparent',
              color: activa
                ? 'var(--color-base)'
                : disponible
                  ? 'var(--color-ink)'
                  : 'var(--color-surface)',
              textDecoration: disponible ? 'none' : 'line-through',
              cursor: disponible ? 'pointer' : 'not-allowed',
              willChange: 'transform',
            }}
          >
            {talla}
          </button>
        )
      })}
    </div>
  )
}
