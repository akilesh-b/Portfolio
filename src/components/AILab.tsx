import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { alivePipeline, labItems } from '../data/content'
import { projectLinks } from '../lib/constants'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { SectionHeader } from './SectionHeader'

function AlivePipeline() {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface-2 p-6 md:p-10">
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
      <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="micro text-faint">
            <span className="text-accent-ink">Framework</span> · agent-based extraction
          </div>
          <h3 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tight md:text-4xl">ALIVE Pipeline</h3>
        </div>
        <p className="max-w-sm text-sm text-muted">Specialised agents hand structured data to each other — from raw PDF to a linked knowledge graph.</p>
      </div>

      <ol className="relative mt-10 grid gap-3 md:grid-cols-5 md:gap-0">
        {/* connecting line with travelling pulse */}
        <span className="absolute left-5 top-0 h-full w-px bg-line-strong md:left-0 md:top-5 md:h-px md:w-full" aria-hidden />
        <span className="alive-pulse absolute left-[1.1rem] h-3 w-3 rounded-full bg-lime shadow-[0_0_20px_4px_rgb(223_255_79/0.6)] md:top-[0.95rem]" aria-hidden />
        {alivePipeline.map((step, i) => (
          <li key={step} className="relative flex items-center gap-4 md:flex-col md:items-start md:gap-4 md:pr-4">
            <span
              className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-[0.65rem] ${
                i === alivePipeline.length - 1 ? 'border-transparent bg-lime text-night' : 'border-line-strong bg-surface'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="font-display text-lg font-semibold">{step}</div>
              <div className="micro text-[0.55rem] text-faint">{i === alivePipeline.length - 1 ? 'output' : 'agent'}</div>
            </div>
          </li>
        ))}
      </ol>
      <style>{`
        @keyframes alive-x { from { left: 0%; } to { left: calc(100% - 12px); } }
        @keyframes alive-y { from { top: 0%; } to { top: calc(100% - 12px); } }
        .alive-pulse { animation: alive-y 3.2s cubic-bezier(.65,0,.35,1) infinite alternate; }
        @media (min-width: 768px) { .alive-pulse { animation-name: alive-x; } }
      `}</style>
    </div>
  )
}

export function AILab() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.matchMedia().add(MQ.motion, () => {
        gsap.from(q('.lab-card'), { y: 60, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: q('.lab-grid')[0], start: 'top 85%' } })
      })
    },
    { scope: root },
  )

  return (
    <section id="lab" ref={root} aria-label="AI Lab" className="tone-dark section-card z-[60] overflow-hidden pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="container-x relative">
        <SectionHeader
          index="05"
          title="AI Lab"
          subtitle="Experiments, mini projects and ideas I'm working on."
          aside={
            <a
              href={projectLinks.allProjects}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-lime hover:bg-lime hover:text-night"
              data-cursor="link"
            >
              View all experiments <ArrowUpRight size={14} />
            </a>
          }
        />

        <ul className="lab-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labItems.map((item, i) => {
            const Icon = item.icon
            return (
              <li key={item.title} className="lab-card">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface-2 p-6 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1.5 hover:border-lime/40 md:p-7">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-lime/0 blur-3xl transition-colors duration-700 group-hover:bg-lime/20" aria-hidden />
                  <div className="flex items-start justify-between">
                    <span className="relative grid h-14 w-14 place-items-center">
                      <svg className="spin-slow absolute inset-0 h-full w-full text-accent-ink opacity-50 group-hover:opacity-100" viewBox="0 0 56 56" aria-hidden style={{ animationDuration: `${18 + i * 3}s` }}>
                        <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" />
                        <circle cx="28" cy="2" r="2" fill="currentColor" />
                      </svg>
                      <Icon size={22} strokeWidth={1.5} className="text-ink transition-transform duration-500 group-hover:scale-110" aria-hidden />
                    </span>
                    <span className="micro flex items-center gap-2 text-[0.58rem] text-faint">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" aria-hidden />
                      {item.status}
                    </span>
                  </div>
                  <h3 className="mt-10 font-display text-2xl font-semibold uppercase tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-muted">{item.description}</p>
                  <div className="micro mt-8 flex items-center justify-between border-t border-line pt-4 text-[0.58rem] text-faint">
                    <span>EXP-{String(i + 1).padStart(3, '0')}</span>
                    <ArrowUpRight size={16} className="text-ink transition-transform duration-500 group-hover:rotate-45" aria-hidden />
                  </div>
                </article>
              </li>
            )
          })}
        </ul>

        <div className="mt-10">
          <AlivePipeline />
        </div>
      </div>
    </section>
  )
}
