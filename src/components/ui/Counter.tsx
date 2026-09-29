import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'

interface StatLike {
  value?: number
  suffix?: string
  text?: string
  pad?: boolean
}

/** Counts up to `value` when scrolled into view (or renders static `text`). */
export function Counter({ stat, delay = 0, trigger }: { stat: StatLike; delay?: number; trigger?: 'scroll' | 'now' }) {
  const ref = useRef<HTMLSpanElement>(null)
  const format = (n: number) => (stat.pad ? String(n).padStart(2, '0') : String(n)) + (stat.suffix ?? '')

  useGSAP(
    () => {
      const el = ref.current
      if (!el || stat.value === undefined) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const obj = { n: 0 }
      el.textContent = format(0)
      gsap.to(obj, {
        n: stat.value,
        duration: 1.6,
        delay,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(Math.round(obj.n))
        },
        scrollTrigger: trigger === 'now' ? undefined : { trigger: el, start: 'top 92%', once: true },
      })
    },
    { dependencies: [delay] },
  )

  return (
    <span ref={ref} className="tabular-nums">
      {stat.value !== undefined ? format(stat.value) : stat.text}
    </span>
  )
}
