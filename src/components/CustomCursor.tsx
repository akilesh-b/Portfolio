import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

type Mode = 'default' | 'hover' | 'view' | 'link' | 'explore'

const LABELS: Partial<Record<Mode, string>> = {
  view: 'View project ↗',
  link: '↗',
  explore: 'Explore',
}

/**
 * Additive cursor follower for fine pointers. The native cursor is never
 * hidden, so accessibility and precision are unaffected.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('default')

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const d = dot.current
    const r = ring.current
    if (!d || !r) return

    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' })

    let shown = false
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      if (!shown) {
        gsap.set([d, r], { x: e.clientX, y: e.clientY })
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 })
        shown = true
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      const tagged = t?.closest<HTMLElement>('[data-cursor]')
      if (tagged) {
        setMode((tagged.dataset.cursor as Mode) || 'hover')
        return
      }
      setMode(t?.closest('a, button, [role="button"], input, textarea') ? 'hover' : 'default')
    }
    const leave = () => {
      gsap.to([d, r], { autoAlpha: 0, duration: 0.3 })
      shown = false
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  const label = LABELS[mode]
  const big = mode === 'view' || mode === 'explore'
  const size = big ? 104 : mode === 'link' ? 56 : mode === 'hover' ? 48 : 32

  return (
    <div className="cursor-root" aria-hidden>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[80] h-1.5 w-1.5 rounded-full bg-lime mix-blend-difference" style={{ opacity: big ? 0 : undefined }} />
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[80]">
        <div
          className={`grid place-items-center rounded-full border text-center transition-all duration-300 [transition-timing-function:var(--ease-out-expo)] ${
            big ? 'border-lime bg-lime text-night' : mode === 'link' ? 'border-lime bg-lime/15 text-lime' : 'border-white/35'
          }`}
          style={{ width: size, height: size, mixBlendMode: big ? 'normal' : 'difference' }}
        >
          {label && <span className={`micro font-semibold leading-tight ${big ? 'px-3 text-[0.62rem]' : 'text-sm'}`}>{label}</span>}
        </div>
      </div>
    </div>
  )
}
