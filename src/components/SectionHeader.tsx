import type { ReactNode } from 'react'
import { RevealText } from './animations/RevealText'
import { FadeUp } from './animations/FadeUp'

interface Props {
  index: string
  title: string
  subtitle?: ReactNode
  aside?: ReactNode
  id?: string
}

/** "02 — WHAT I BUILD" style header used by every section. */
export function SectionHeader({ index, title, subtitle, aside, id }: Props) {
  return (
    <header className="mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <FadeUp className="micro mb-5 flex items-center gap-3 text-faint" distance={16}>
          <span className="text-accent-ink">{index}</span>
          <span className="h-px w-10 bg-line-strong" aria-hidden />
          <span>{title}</span>
        </FadeUp>
        <RevealText
          as="h2"
          lines={[title]}
          className="display-tight text-[clamp(2.5rem,7vw,6rem)] font-semibold uppercase"
        />
        {subtitle && (
          <FadeUp as="p" className="mt-5 max-w-xl text-base text-muted md:text-lg" delay={0.15} distance={20}>
            {subtitle}
          </FadeUp>
        )}
      </div>
      {aside && <div id={id}>{aside}</div>}
    </header>
  )
}
