import { useRef, type MouseEvent, type ReactNode } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { gsap } from '../../lib/gsap'

type Variant = 'primary' | 'ghost'

interface Props {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: Variant
  arrow?: 'up-right' | 'down' | 'none'
  className?: string
  external?: boolean
  ariaLabel?: string
}

const base =
  'group relative inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color,box-shadow] duration-300 will-change-transform select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-lime text-night hover:shadow-[0_0_40px_-6px_rgb(223_255_79/0.7)]',
  ghost: 'border border-line-strong text-ink hover:border-lime hover:bg-lime hover:text-night',
}

/** Pill button with magnetic hover (fine pointers only) and animated arrow. */
export function Button({ children, href, onClick, variant = 'primary', arrow = 'up-right', className, external, ariaLabel }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)

  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const r = el.getBoundingClientRect()
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.22,
      y: (e.clientY - r.top - r.height / 2) * 0.3,
      duration: 0.4,
      ease: 'power3.out',
    })
  }
  const onLeave = () => ref.current && gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })

  const Icon = arrow === 'down' ? ArrowDown : ArrowUpRight
  const content = (
    <>
      <span>{children}</span>
      {arrow !== 'none' && (
        <span className="relative grid h-4 w-4 place-items-center overflow-hidden" aria-hidden>
          <Icon
            size={16}
            className={`transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] ${
              arrow === 'down' ? 'group-hover:translate-y-full' : 'group-hover:translate-x-full group-hover:-translate-y-full'
            }`}
          />
          <Icon
            size={16}
            className={`absolute transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] ${
              arrow === 'down'
                ? '-translate-y-full group-hover:translate-y-0'
                : '-translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0'
            }`}
          />
        </span>
      )}
    </>
  )

  const cls = `${base} ${variants[variant]} ${className ?? ''}`

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={cls}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
        aria-label={ariaLabel}
        data-cursor="link"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" className={cls} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick} aria-label={ariaLabel} data-cursor="link">
      {content}
    </button>
  )
}
