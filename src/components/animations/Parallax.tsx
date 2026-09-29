import { useRef, type ReactNode } from 'react'
import { gsap, MQ, useGSAP } from '../../lib/gsap'
import { parallax } from '../../lib/animations'

interface Props {
  children: ReactNode
  /** Positive = drifts down relative to scroll; parallax is halved on mobile. */
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.12, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add(MQ.desktop, () => {
        parallax(el, speed)
      })
      mm.add(MQ.mobile, () => {
        parallax(el, speed * 0.4)
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={`will-change-transform ${className ?? ''}`}>
      {children}
    </div>
  )
}
