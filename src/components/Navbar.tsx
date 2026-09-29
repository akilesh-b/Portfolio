import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu } from 'lucide-react'
import { connectLink, navItems, profile, type SectionId } from '../lib/constants'
import { useLenis } from '../hooks/useLenis'
import { MobileMenu } from './MobileMenu'

export function Navbar({ active }: { active: SectionId }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollTo } = useLenis()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeNav = navItems.find((n) => n.covers.includes(active))?.target ?? 'home'

  const go = (id: SectionId) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollTo(`#${id}`)
  }

  return (
    <>
      <header className="tone-dark pointer-events-none fixed inset-x-0 top-0 z-50">
        <div
          className={`container-x flex items-center justify-between transition-[padding] duration-500 [transition-timing-function:var(--ease-out-expo)] ${
            scrolled ? 'pt-3' : 'pt-5 md:pt-7'
          }`}
        >
          <nav
            aria-label="Primary"
            className={`pointer-events-auto flex w-full items-center justify-between rounded-full border transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
              scrolled
                ? 'border-line bg-surface/90 px-3 py-2 shadow-[0_10px_40px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl md:px-4'
                : 'border-transparent bg-transparent px-0 py-0'
            }`}
          >
            <a
              href="#home"
              onClick={go('home')}
              className="flex items-center gap-3 px-2 text-ink"
              aria-label={`${profile.fullName} — back to top`}
              data-cursor="link"
            >
              <span className="display-tight flex items-center gap-2 text-2xl font-bold">
                AKI<span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
              </span>
              <span className="h-6 w-px bg-line-strong" aria-hidden />
              <span className="font-display text-[0.7rem] font-medium uppercase leading-[1.15] tracking-[0.18em] text-muted sm:text-[0.75rem]">
                Akilesh
                <br />
                Balamurugan
              </span>
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const isActive = activeNav === item.target
                return (
                  <li key={item.target}>
                    <a
                      href={`#${item.target}`}
                      onClick={go(item.target)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`relative flex flex-col items-center px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors ${
                        isActive ? 'text-ink' : 'text-muted hover:text-ink'
                      }`}
                      data-cursor="link"
                    >
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-lime"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href={connectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group hidden items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-lime hover:bg-lime hover:text-night md:flex"
                data-cursor="link"
              >
                Let's connect
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink lg:hidden"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>{open && <MobileMenu active={activeNav} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}
