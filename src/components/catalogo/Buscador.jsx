import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

// Debounce utility — delays callback until user stops typing
const useDebounce = (fn, delay) => {
  const timer = useRef(null)
  return useCallback(
    (...args) => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => fn(...args), delay)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn, delay]
  )
}

export const Buscador = ({ valor, onChange }) => {
  const containerRef = useRef(null)
  const lupaRef = useRef(null)
  const lineRef = useRef(null)
  const [interno, setInterno] = useState(valor ?? '')

  const debouncedChange = useDebounce(onChange, 300)

  // Expand line on mount
  useGSAP(
    () => {
      gsap.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.8,
        ease: 'expo.out',
        delay: 0.3,
      })
    },
    { scope: containerRef }
  )

  const handleChange = (e) => {
    const val = e.target.value
    setInterno(val)
    debouncedChange(val)

    // Hide/show lupa based on input value
    gsap.to(lupaRef.current, {
      opacity: val.length > 0 ? 0 : 1,
      scale: val.length > 0 ? 0.7 : 1,
      duration: 0.25,
      ease: 'power2.out',
    })
  }

  const handleFocus = () => {
    gsap.to(lineRef.current, {
      scaleX: 1,
      background: 'var(--color-accent)',
      duration: 0.4,
      ease: 'expo.out',
    })
  }

  const handleBlur = () => {
    gsap.to(lineRef.current, {
      background: 'var(--color-surface)',
      duration: 0.3,
    })
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        {/* Search icon */}
        <span
          ref={lupaRef}
          className="absolute left-0 pointer-events-none text-[var(--color-muted)]"
          style={{ fontSize: '0.9rem' }}
          aria-hidden
        >
          &#x2315;
        </span>

        <input
          type="search"
          value={interno}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Buscar pieza..."
          aria-label="Buscar productos"
          className="w-full bg-transparent outline-none pl-6 py-4 font-serif font-light text-[var(--color-ink)]"
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            letterSpacing: '-0.01em',
          }}
        />

        {/* Clear button */}
        {interno && (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              setInterno('')
              onChange('')
              gsap.to(lupaRef.current, { opacity: 1, scale: 1, duration: 0.25 })
            }}
            className="label-xs text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors pr-1"
          >
            ×
          </button>
        )}
      </div>

      {/* Animated bottom line */}
      <div
        ref={lineRef}
        className="h-px w-full"
        style={{ background: 'var(--color-surface)', transformOrigin: 'left center' }}
      />
    </div>
  )
}
