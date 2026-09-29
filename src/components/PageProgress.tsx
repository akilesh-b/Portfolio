import { useEffect, useRef } from 'react'
import { sections, type SectionId } from '../lib/constants'
import { useLenis } from '../hooks/useLenis'

/** Desktop: vertical 01–09 rail. Mobile: thin lime bar under the navbar. */
export function PageProgress({ active }: { active: SectionId }) {
  const bar = useRef<HTMLDivElement>(null)
  const { scrollTo } = useLenis()

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[55] h-[2px] lg:hidden" aria-hidden>
        <div ref={bar} className="h-full origin-left scale-x-0 bg-lime" />
      </div>

      <nav
        aria-label="Section progress"
        className="tone-dark fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center rounded-full border border-line bg-surface/90 px-2 py-4 backdrop-blur-md lg:flex 2xl:right-8"
      >
        {sections.map((s, i) => {
          const isActive = s.id === active
          return (
            <div key={s.id} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => scrollTo(`#${s.id}`)}
                className={`micro group relative px-1 py-1 text-[0.6rem] transition-colors ${isActive ? 'text-accent-ink' : 'text-faint hover:text-ink'}`}
                aria-label={`Go to ${s.label}`}
                aria-current={isActive ? 'true' : undefined}
                data-cursor="link"
              >
                {s.index}
                <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-surface-3 px-2.5 py-1 text-ink opacity-0 transition-opacity group-hover:opacity-100">
                  {s.label}
                </span>
              </button>
              {i < sections.length - 1 && (
                <span className={`my-1 w-px transition-all duration-500 ${isActive ? 'h-6 bg-lime' : 'h-3 bg-line-strong'}`} aria-hidden />
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
