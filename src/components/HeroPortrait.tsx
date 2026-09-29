import { forwardRef, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import portraitCutout from '../assets/images/portrait-cutout.webp'

/**
 * Layered cutout portrait: ghost echo + rim-lit main image.
 * Layers respond to the pointer with different depths (desktop only).
 * The face pixels themselves are never altered — only lighting around them.
 */
export const HeroPortrait = forwardRef<HTMLDivElement, { className?: string; ghost?: boolean; tall?: boolean }>(function HeroPortrait({ className, ghost = true, tall = false }, ref) {
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stage.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const layers = [
      { el: el.querySelector('.pl-main'), d: 14 },
      { el: el.querySelector('.pl-ghost'), d: -26 },
    ]
    const setters = layers
      .filter((l) => l.el)
      .map((l) => ({
        d: l.d,
        x: gsap.quickTo(l.el!, 'x', { duration: 1.1, ease: 'power3' }),
        y: gsap.quickTo(l.el!, 'y', { duration: 1.1, ease: 'power3' }),
      }))
    const rotY = gsap.quickTo(el, 'rotationY', { duration: 1.2, ease: 'power3' })
    const rotX = gsap.quickTo(el, 'rotationX', { duration: 1.2, ease: 'power3' })

    const move = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      setters.forEach((s) => {
        s.x(nx * s.d)
        s.y(ny * s.d * 0.5)
      })
      rotY(nx * 4)
      rotX(-ny * 2.5)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <div ref={ref} className={className} data-cursor="explore">
      <div ref={stage} className="relative h-full w-full [perspective:1200px] [transform-style:preserve-3d]">
        {/* ghost echo */}
        {ghost && (
        <img
          src={portraitCutout}
          alt=""
          aria-hidden
          className="pl-ghost absolute bottom-0 left-[-14%] h-[92%] w-auto max-w-none object-contain opacity-[0.13] grayscale [mask-image:linear-gradient(to_right,black_30%,transparent_85%)]"
          draggable={false}
        />
        )}
        {/* main portrait */}
        <img
          src={portraitCutout}
          alt="Portrait of Akilesh wearing a black suit"
          width={888}
          height={1025}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className={
            tall
              ? // fills the height and lets the shoulders fade out at the sides
                'pl-main portrait-main absolute bottom-0 left-1/2 z-10 h-full w-auto max-w-none -translate-x-1/2 object-contain [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,black_74%,transparent),linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]'
              : 'pl-main portrait-main relative z-10 mx-auto h-full w-auto max-w-none object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]'
          }
          style={{
            filter:
              'contrast(1.04) saturate(1.02) drop-shadow(0 0 1px rgb(223 255 79 / 0.35)) drop-shadow(0 30px 60px rgb(0 0 0 / 0.45))',
          }}
        />
      </div>
    </div>
  )
})
