import { useRef } from 'react'
import { Flag } from 'lucide-react'
import { journey } from '../data/journey'
import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/gsap'
import { SectionHeader } from './SectionHeader'
import portraitCutout from '../assets/images/portrait-cutout.webp'

export function Journey() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const list = q('.tl-list')[0]
      const mm = gsap.matchMedia()

      mm.add(MQ.motion, () => {
        gsap.fromTo(q('.tl-progress'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: true } })
        q('.tl-item').forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 60%',
            onEnter: () => item.classList.add('is-lit'),
            onLeaveBack: () => item.classList.remove('is-lit'),
          })
          gsap.from(item.querySelector('.tl-body'), { x: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: item, start: 'top 82%' } })
        })
      })
      mm.add(MQ.reduce, () => {
        q('.tl-item').forEach((i) => i.classList.add('is-lit'))
        gsap.set(q('.tl-progress'), { scaleY: 1 })
      })
    },
    { scope: root },
  )

  return (
    <section id="journey" ref={root} aria-label="Journey" className="tone-light section-card z-50 pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionHeader index="04" title="Journey" subtitle="Student → learner → builder → AI explorer. My learning and building journey so far." />

            <div className="hidden items-center gap-4 rounded-3xl border border-line bg-surface-2 p-4 lg:flex">
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-night">
                <img src={portraitCutout} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
              </div>
              <div>
                <div className="micro text-[0.58rem] text-faint">Current position</div>
                <div className="font-display text-lg font-semibold">AI Engineer &amp; Builder</div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> B.E. CSE · 2024 — 2028
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ol className="tl-list relative">
            {/* rail */}
            <span className="absolute bottom-0 left-[5.5rem] top-2 w-px bg-line-strong md:left-[8.5rem]" aria-hidden />
            <span className="tl-progress absolute bottom-0 left-[5.5rem] top-2 w-px origin-top bg-olive md:left-[8.5rem]" aria-hidden />

            {journey.map((j, i) => (
              <li key={`${j.year}-${j.title}`} className="tl-item group relative grid grid-cols-[5.5rem_1fr] pb-14 last:pb-0 md:grid-cols-[8.5rem_1fr]">
                <div className="pr-6 text-right md:pr-10">
                  <span className="font-display text-xl font-semibold tabular-nums text-faint transition-colors duration-500 group-[.is-lit]:text-ink md:text-3xl">{j.year}</span>
                </div>
                {/* node */}
                <span
                  className="absolute left-[5.5rem] top-2 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border border-line-strong bg-surface transition-all duration-500 group-[.is-lit]:scale-110 group-[.is-lit]:border-olive md:left-[8.5rem]"
                  aria-hidden
                >
                  <span className="h-2 w-2 rounded-full bg-line-strong transition-colors duration-500 group-[.is-lit]:bg-olive" />
                  <span className="absolute inset-[-6px] rounded-full bg-lime/40 opacity-0 blur-md transition-opacity duration-500 group-[.is-lit]:opacity-100" />
                </span>
                <div className="tl-body pl-8 md:pl-12">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-2xl font-semibold uppercase tracking-tight md:text-3xl">{j.title}</h3>
                    {j.current && <span className="micro rounded-full bg-lime px-2.5 py-1 text-[0.55rem] text-night">Now</span>}
                  </div>
                  <p className="mt-2 max-w-xl text-muted">{j.description}</p>
                  {j.tags && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {j.tags.map((t) => (
                        <li key={t} className="micro rounded-full border border-line px-2.5 py-1 text-[0.58rem] text-faint">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="sr-only">Milestone {i + 1} of {journey.length}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="ml-[5.5rem] mt-14 flex items-center gap-4 rounded-3xl border border-dashed border-line-strong p-5 pl-8 md:ml-[8.5rem] md:pl-12">
            <Flag size={18} className="text-olive" aria-hidden />
            <div>
              <div className="micro text-[0.58rem] text-faint">Next stop</div>
              <div className="font-display text-lg font-semibold">Build something bigger.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
