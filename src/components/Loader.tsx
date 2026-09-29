import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import portraitCutout from '../assets/images/portrait-cutout.webp'

/**
 * Short intro: waits for fonts + hero portrait (min ~0.9s, max ~2.4s),
 * then wipes upward and hands over to the hero timeline.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.documentElement.style.overflow = 'hidden'
    const progress = { v: 0 }
    const fill = gsap.to(progress, {
      v: 90,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        setPct(Math.round(progress.v))
        if (bar.current) bar.current.style.transform = `scaleX(${progress.v / 100})`
      },
    })

    const img = new Image()
    img.src = portraitCutout
    const assets = Promise.all([document.fonts?.ready ?? Promise.resolve(), img.decode().catch(() => undefined)])
    const minTime = new Promise((r) => setTimeout(r, reduced ? 200 : 900))
    const maxTime = new Promise((r) => setTimeout(r, 2400))

    let cancelled = false
    Promise.race([Promise.all([assets, minTime]), maxTime]).then(() => {
      if (cancelled) return
      fill.kill()
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = ''
          onDone()
        },
      })
      tl.to(progress, {
        v: 100,
        duration: 0.35,
        ease: 'power2.inOut',
        onUpdate: () => {
          setPct(Math.round(progress.v))
          if (bar.current) bar.current.style.transform = `scaleX(${progress.v / 100})`
        },
      })
        .to('.loader-inner', { yPercent: -40, autoAlpha: 0, duration: 0.6, ease: 'power3.in' })
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' }, '-=0.25')
    })

    return () => {
      cancelled = true
      fill.kill()
      document.documentElement.style.overflow = ''
    }
  }, [onDone])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] grid place-items-center bg-night text-[#F4F4EF]"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="loader-inner flex w-[min(80vw,340px)] flex-col items-center">
        <div className="display-tight text-7xl font-bold md:text-8xl">
          AKI<span className="text-lime">.</span>
        </div>
        <div className="micro mt-6 flex w-full justify-between text-[#F4F4EF]/50">
          <span>Loading experience…</span>
          <span className="tabular-nums text-lime">{String(pct).padStart(3, '0')}</span>
        </div>
        <div className="mt-3 h-px w-full bg-white/10">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-lime" />
        </div>
      </div>
    </div>
  )
}
