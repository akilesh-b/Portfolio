import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { navItems, profile, type SectionId } from '../lib/constants'
import { useLenis } from '../hooks/useLenis'
import { SocialLinks } from './SocialLinks'

const labels: Record<string, string> = { Blogs: 'Blog' }

export function MobileMenu({ active, onClose }: { active: SectionId; onClose: () => void }) {
  const { scrollTo, stop, start } = useLenis()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    stop()
    const prev = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      start()
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [onClose, stop, start])

  const go = (id: SectionId) => (e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
    // resume smooth scrolling right away (unmount cleanup only runs after the exit animation)
    start()
    setTimeout(() => scrollTo(`#${id}`), 250)
  }

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="tone-dark fixed inset-0 z-[70] flex flex-col bg-surface text-ink lg:hidden"
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative flex items-center justify-between pt-5">
        <span className="display-tight text-2xl font-bold">
          AKI<span className="text-accent-ink">.</span>
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full border border-line-strong"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="container-x relative flex flex-1 flex-col justify-center" aria-label="Mobile">
        <ul className="space-y-1">
          {navItems.map((item, i) => (
            <motion.li
              key={item.target}
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={`#${item.target}`}
                onClick={go(item.target)}
                className="group flex items-baseline gap-4 border-b border-line py-3"
                aria-current={active === item.target ? 'true' : undefined}
              >
                <span className={`micro ${active === item.target ? 'text-accent-ink' : 'text-faint'}`}>{String(i + 1).padStart(2, '0')}</span>
                <span
                  className={`display-tight text-[clamp(2.4rem,11vw,4rem)] font-semibold uppercase transition-colors ${
                    active === item.target ? 'text-accent-ink' : 'text-ink group-active:text-accent-ink'
                  }`}
                >
                  {labels[item.label] ?? item.label}
                </span>
                <ArrowUpRight className="ml-auto self-center text-faint" size={20} aria-hidden />
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>

      <motion.div
        className="container-x relative flex items-center justify-between pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="micro text-faint">{profile.location}</div>
        <SocialLinks size="sm" />
      </motion.div>
    </motion.div>
  )
}
