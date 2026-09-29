import { createElement, useRef, type ReactNode } from 'react'
import { useGSAP } from '../../lib/gsap'
import { splitTextReveal } from '../../lib/animations'

interface Props {
  /** Each entry renders as one masked line. */
  lines: ReactNode[]
  as?: 'div' | 'p' | 'span' | 'h2' | 'h3'
  className?: string
  lineClassName?: string
  stagger?: number
  start?: string
  /** When false the lines are rendered but not animated (e.g. driven by a parent timeline). */
  animate?: boolean
}

/** Line-by-line mask reveal. Lines keep their text in the DOM for accessibility. */
export function RevealText({ lines, as = 'div', className, lineClassName, stagger, start, animate = true }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!animate || !ref.current) return
      const mm = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (mm.matches) return
      splitTextReveal(ref.current, { stagger, start })
    },
    { scope: ref },
  )

  return createElement(
    as,
    { ref, className },
    lines.map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
        <span className={`line-inner block will-change-transform ${lineClassName ?? ''}`}>{line}</span>
      </span>
    )),
  )
}
