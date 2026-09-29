import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { technologies, toolbelt } from '../data/technologies'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { useInView } from '../hooks/useInView'
import { SectionHeader } from './SectionHeader'
import { BrandIcon } from './ui/BrandIcon'

const CODE = `const aki = {
  passion: 'Build',
  focus: 'AI Engineering',
  location: 'Coimbatore',
  learning: Infinity,
};`

function TypedCode() {
  const ref = useRef<HTMLPreElement>(null)
  const inView = useInView(ref, '0px')
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || n >= CODE.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(CODE.length)
      return
    }
    const id = setTimeout(() => setN((v) => v + 1), 22)
    return () => clearTimeout(id)
  }, [inView, n])

  const text = CODE.slice(0, n)
  // tiny syntax colouring
  const html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/('.*?'|Infinity)/g, '<span class="text-accent-ink">$1</span>')
    .replace(/\b(const)\b/g, '<span class="text-faint">$1</span>')

  return (
    <pre
      ref={ref}
      className="relative min-h-[9.5rem] overflow-hidden rounded-2xl border border-line bg-surface-2 p-5 font-mono text-[0.78rem] leading-relaxed text-muted"
      aria-label={CODE}
    >
      <code aria-hidden dangerouslySetInnerHTML={{ __html: html }} />
      <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-lime" aria-hidden />
    </pre>
  )
}

export function TechStack() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const tech = technologies[active]

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from(q('.tech-card'), {
          y: 50,
          rotateX: -35,
          autoAlpha: 0,
          transformOrigin: '50% 100%',
          stagger: { each: 0.045, from: 'start' },
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.tech-grid')[0], start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="stack" ref={root} aria-label="Tech stack" className="tone-dark section-card z-40 overflow-hidden pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl" style={{ background: 'radial-gradient(circle, var(--glow), transparent 70%)' }} aria-hidden />
      <div className="container-x relative">
        <SectionHeader index="03" title="Tech Stack" subtitle="Tools and technologies I work with." aside={<div className="hidden w-[340px] md:block"><TypedCode /></div>} />

        <div className="grid gap-8 lg:grid-cols-12">
          {/* readout */}
          <div className="lg:col-span-4" aria-live="polite">
            <div className="relative h-full min-h-[220px] overflow-hidden rounded-[1.75rem] border border-line bg-surface-2 p-7">
              <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
              <AnimatePresence mode="wait">
                <motion.div
                  key={tech.name}
                  className="relative flex h-full flex-col"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/95 shadow-lg">
                      <BrandIcon icon={tech.icon} brand size={28} />
                    </span>
                    <span className="micro text-faint">{String(active + 1).padStart(2, '0')} / {technologies.length}</span>
                  </div>
                  <div className="mt-auto pt-10">
                    <div className="display-tight text-5xl font-semibold uppercase">{tech.name}</div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {tech.context.map((c) => (
                        <li key={c} className="micro rounded-full border border-lime/40 bg-lime/10 px-3 py-1.5 text-[0.62rem] text-accent-ink">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* grid */}
          <ul className="tech-grid grid grid-cols-3 gap-3 [perspective:900px] sm:grid-cols-4 lg:col-span-8 lg:grid-cols-5 xl:grid-cols-5">
            {technologies.map((t, i) => {
              const on = i === active
              return (
                <li key={t.name} className="tech-card">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    aria-label={`${t.name}: ${t.context.join(', ')}`}
                    className={`group relative flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1.5 ${
                      on ? 'border-lime/60 bg-lime/[0.07] shadow-[0_18px_40px_-24px_rgb(223_255_79/0.6)]' : 'border-line bg-surface-2 hover:border-line-strong'
                    }`}
                    data-cursor="link"
                  >
                    <span className={`transition-all duration-500 ${on ? 'scale-110 text-ink' : 'text-muted group-hover:text-ink'}`}>
                      <BrandIcon icon={t.icon} size={30} />
                    </span>
                    <span className={`micro text-[0.58rem] transition-colors ${on ? 'text-accent-ink' : 'text-faint'}`}>{t.name}</span>
                    {on && <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />}
                  </button>
                </li>
              )
            })}
            {/* filler cell completes the grid on desktop */}
            <li className="tech-card hidden lg:block" aria-hidden>
              <div className="micro flex aspect-square w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line text-center text-[0.58rem] text-faint">
                + always
                <br />
                learning
              </div>
            </li>
          </ul>
        </div>

        <div className="mt-8 md:hidden">
          <TypedCode />
        </div>

        {/* toolbelt */}
        <div className="mt-14">
          <div className="micro mb-5 text-faint">Also in the toolbelt — AI / ML libraries, hardware &amp; platforms</div>
          <ul className="flex flex-wrap gap-2">
            {toolbelt.map((t) => (
              <li key={t.name} className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-lime/50 hover:text-ink">
                {t.icon && <BrandIcon icon={t.icon} size={14} />}
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
