import { createElement, useRef, type ReactNode } from 'react'
import { useGSAP } from '../../lib/gsap'
import { fadeUp, staggerReveal } from '../../lib/animations'

interface Props {
  children: ReactNode
  as?: 'div' | 'p' | 'ul' | 'span' | 'section'
  className?: string
  delay?: number
  distance?: number
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: number
  start?: string
}

export function FadeUp({ children, as = 'div', className, delay, distance, stagger, start }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      if (stagger) staggerReveal(el.children, { trigger: el, stagger, distance, start })
      else fadeUp(el, { delay, distance, start })
    },
    { scope: ref },
  )

  return createElement(as, { ref, className }, children)
}
