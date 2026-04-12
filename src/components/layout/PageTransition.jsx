import { useRef } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

// Page-level transition: subtle fade + scroll reset on route change.
// A thin curtain wipes from the top to mark the navigation, then retracts.
export const PageTransition = () => {
  const location = useLocation()
  const wrapperRef = useRef(null)
  const curtainRef = useRef(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      // Always start each page at the top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

      if (reduceMotion) {
        gsap.set(wrapperRef.current, { opacity: 1, y: 0 })
        gsap.set(curtainRef.current, { display: 'none' })
        return
      }

      const tl = gsap.timeline()

      // Curtain wipe: starts covering top, slides up out of view
      gsap.set(curtainRef.current, {
        display: 'block',
        scaleY: 1,
        transformOrigin: 'top center',
      })
      gsap.set(wrapperRef.current, { opacity: 0, y: 18 })

      tl.to(curtainRef.current, {
        scaleY: 0,
        duration: 0.9,
        ease: 'expo.inOut',
      })
        .to(
          wrapperRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
          '-=0.55'
        )
        .set(curtainRef.current, { display: 'none' })
    },
    { dependencies: [location.pathname] }
  )

  return (
    <>
      {/* Curtain — full-screen overlay used for the wipe */}
      <div
        ref={curtainRef}
        aria-hidden
        className="fixed inset-0 z-[80] pointer-events-none"
        style={{
          background: 'var(--color-ink)',
          willChange: 'transform',
        }}
      />
      <div ref={wrapperRef} style={{ willChange: 'transform, opacity' }}>
        <Outlet />
      </div>
    </>
  )
}
