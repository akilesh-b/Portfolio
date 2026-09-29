import { ArrowUp } from 'lucide-react'
import { useLenis } from '../hooks/useLenis'
import { profile } from '../lib/constants'

export function Footer() {
  const { scrollTo } = useLenis()
  return (
    <footer className="tone-dark relative z-[80] border-t border-line bg-surface text-ink">
      <div className="container-x flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="display-tight text-2xl font-bold">
            AKI<span className="text-accent-ink">.</span>
          </span>
          <span className="micro text-[0.6rem] text-faint">AI Engineer · Builder · Explorer</span>
        </div>
        <div className="flex items-center justify-between gap-6 md:justify-end">
          <p className="micro text-[0.6rem] text-faint">
            © 2026 {profile.fullName} <span aria-hidden>·</span> Built with curiosity + code.
          </p>
          <button
            type="button"
            onClick={() => scrollTo('#home')}
            className="group grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line-strong transition-colors hover:border-lime hover:bg-lime hover:text-night"
            aria-label="Back to top"
            data-cursor="link"
          >
            <ArrowUp size={18} className="transition-transform duration-500 group-hover:-rotate-12 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
