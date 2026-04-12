import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Subtle magnetic hover — element follows cursor toward its bounding center.
// Uses gsap.quickTo for high-frequency mousemove updates.
export const useMagnetic = ({ strength = 0.35, ease = 'power3.out' } = {}) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip on coarse pointers / reduced motion
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (!finePointer || reduceMotion) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease })

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      xTo((e.clientX - cx) * strength)
      yTo((e.clientY - cy) * strength)
    }

    const handleLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength, ease])

  return ref
}
