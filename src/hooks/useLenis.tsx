import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

interface ScrollApi {
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void
  stop: () => void
  start: () => void
}

const ScrollCtx = createContext<ScrollApi | null>(null)

/**
 * Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger and Lenis
 * share one RAF. Falls back to native scrolling for reduced-motion users.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback<ScrollApi['scrollTo']>((target, opts) => {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (el === null) return
    const lenis = lenisRef.current
    // A pinned section reports its fixed position; its pin-spacer holds the real layout slot.
    const dest = el instanceof HTMLElement ? ((el.closest('.pin-spacer') as HTMLElement | null) ?? el) : el
    if (lenis) {
      lenis.scrollTo(dest, { offset: opts?.offset ?? 0, immediate: opts?.immediate, duration: 1.4 })
    } else if (typeof el === 'number') {
      window.scrollTo({ top: el })
    } else {
      ;(dest as HTMLElement).scrollIntoView({ block: 'start' })
    }
    // Move keyboard focus to the section for screen-reader / keyboard users.
    if (el instanceof HTMLElement) {
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
  }, [])

  const api: ScrollApi = {
    scrollTo,
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  }

  return <ScrollCtx.Provider value={api}>{children}</ScrollCtx.Provider>
}

export function useLenis(): ScrollApi {
  const ctx = useContext(ScrollCtx)
  if (!ctx) throw new Error('useLenis must be used inside <SmoothScrollProvider>')
  return ctx
}
