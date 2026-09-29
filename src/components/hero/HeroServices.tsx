import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { heroServices } from '../../data/content'

/** Stacked focus cards on the right of the hero. The "+" expands a short detail. */
export function HeroServices({ className }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <ul className={`flex flex-col gap-2.5 ${className ?? ''}`} aria-label="What I work on">
      {heroServices.map((s, i) => {
        const Icon = s.icon
        const isOpen = open === i
        return (
          <li key={s.title} className="hero-service">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`group w-full rounded-2xl border bg-[#0d0f0d]/80 px-4 py-3 text-left backdrop-blur-md transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-x-1 ${
                isOpen ? 'border-lime/50' : 'border-white/10 hover:border-lime/40'
              }`}
              data-cursor="link"
            >
              <span className="flex items-center gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-lime transition-colors group-hover:border-lime/40">
                  <Icon size={18} strokeWidth={1.5} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-[#F4F4EF]">{s.title}</span>
                  <span className="micro block truncate text-[0.56rem] text-white/45">{s.sub}</span>
                </span>
                <Plus size={16} className={`shrink-0 text-lime transition-transform duration-500 ${isOpen ? 'rotate-45' : 'group-hover:rotate-90'}`} aria-hidden />
              </span>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.span
                    className="block overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="block pt-3 text-[0.78rem] leading-relaxed text-white/60">{s.detail}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
