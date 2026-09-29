import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, GraduationCap, Languages, MapPin } from 'lucide-react'
import { aboutStats } from '../data/content'
import { philosophy } from '../data/journey'
import { profile } from '../lib/constants'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { imageReveal } from '../lib/animations'
import portrait from '../assets/images/portrait.webp'
import { SectionHeader } from './SectionHeader'
import { Counter } from './ui/Counter'
import { FadeUp } from './animations/FadeUp'

const LEAD = "I'm Akilesh — a Computer Science Engineering student focused on AI engineering and software development."
const tags = ['CSE', 'AI / ML', 'Software Engineering', 'Product Builder']

export function About() {
  const root = useRef<HTMLElement>(null)
  const [more, setMore] = useState(false)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        imageReveal(q('.about-frame')[0])
        gsap.from(q('.about-shape'), { scale: 0.6, rotate: -12, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: q('.about-frame')[0], start: 'top 80%' } })
        // words light up as the paragraph scrolls through the viewport
        gsap.fromTo(
          q('.lead-word'),
          { opacity: 0.18 },
          { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: q('.lead')[0], start: 'top 80%', end: 'bottom 45%', scrub: true } },
        )
        gsap.from(q('.phil-step'), { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: q('.phil')[0], start: 'top 88%' } })
        gsap.from(q('.phil-line'), { scaleX: 0, transformOrigin: 'left', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: q('.phil')[0], start: 'top 88%' } })
      })
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} aria-label="About me" className="tone-light section-card z-10 pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="container-x">
        <SectionHeader index="02" title="About Me" />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* portrait */}
          <div className="lg:col-span-4">
            <div className="relative mx-auto max-w-[360px] lg:mx-0">
              <div className="about-shape absolute -left-5 -top-5 h-[70%] w-[80%] rounded-[2.5rem] bg-lime" aria-hidden />
              <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border border-ink/25" aria-hidden />
              <div className="about-frame group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-night" data-cursor="explore">
                <img
                  src={portrait}
                  alt="Akilesh, smiling, in a black suit against a grey studio backdrop"
                  loading="lazy"
                  decoding="async"
                  width={1086}
                  height={1086}
                  className="h-full w-full object-cover object-[50%_20%] transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105"
                />
                <div className="micro absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-[0.58rem] text-white/85 backdrop-blur">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> Open to opportunities
                </div>
              </div>
            </div>
            <dl className="micro mt-10 space-y-1.5 text-[0.62rem] text-faint">
              <dt className="font-display text-base font-bold tracking-normal text-ink">AKI</dt>
              <dd>CSE · AI / ML</dd>
              <dd>Software Engineering</dd>
              <dd>{profile.location}</dd>
            </dl>
          </div>

          {/* copy */}
          <div className="lg:col-span-5">
            <p className="lead font-display text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-[1.15] tracking-tight">
              {LEAD.split(' ').map((w, i) => (
                <span key={i} className="lead-word">
                  {w}{' '}
                </span>
              ))}
            </p>
            <FadeUp as="p" className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
              I enjoy turning ideas into working products, exploring new technologies and building intelligent systems that create real impact.
            </FadeUp>

            <FadeUp as="ul" className="mt-8 flex flex-wrap gap-2" stagger={0.06} distance={16}>
              {tags.map((t) => (
                <li key={t} className="micro rounded-full border border-line-strong bg-surface-2 px-4 py-2 text-[0.65rem]">
                  {t}
                </li>
              ))}
            </FadeUp>

            <div className="mt-10">
              <button
                type="button"
                onClick={() => setMore((v) => !v)}
                aria-expanded={more}
                aria-controls="about-more"
                className="group inline-flex items-center gap-3 rounded-full bg-lime px-6 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-night transition-shadow hover:shadow-[0_10px_30px_-10px_rgb(120_150_0/0.6)]"
                data-cursor="link"
              >
                {more ? 'Less about me' : 'More about me'}
                <ArrowUpRight size={16} className={`transition-transform duration-500 ${more ? 'rotate-90' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {more && (
                <motion.div
                  id="about-more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 space-y-5 border-t border-line pt-8 text-muted">
                    <p>
                      I study at {profile.institution} in Coimbatore. My interests sit at the intersection of AI, software engineering and creative technology — AI-powered
                      applications, RAG systems, document intelligence pipelines, computer vision tools, backend systems and interactive web experiences.
                    </p>
                    <p>
                      I learn primarily by building: take an idea, research the technology behind it, create a working prototype, and keep improving it into a useful product.
                    </p>
                    <ul className="grid gap-3 pt-2 text-sm text-ink sm:grid-cols-2">
                      <li className="flex items-center gap-3">
                        <GraduationCap size={16} className="text-olive" /> {profile.education}, {profile.period}
                      </li>
                      <li className="flex items-center gap-3">
                        <MapPin size={16} className="text-olive" /> {profile.location}
                      </li>
                      <li className="flex items-center gap-3">
                        <Languages size={16} className="text-olive" /> {profile.languages.join(' · ')}
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* stats */}
          <dl className="grid grid-cols-2 content-start gap-px self-start overflow-hidden rounded-3xl border border-line bg-line lg:col-span-3">
            {aboutStats.map((s) => (
              <div key={s.label} className="flex flex-col gap-2 bg-surface p-6">
                <dd className="font-display text-4xl font-medium tracking-tight md:text-5xl">
                  <Counter stat={s} />
                </dd>
                <dt className="micro order-first text-[0.58rem] text-faint">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* development philosophy */}
        <div className="phil relative mt-24 md:mt-32">
          <div className="micro mb-8 text-faint">How I build</div>
          <div className="relative">
            <div className="phil-line absolute left-0 right-0 top-[1.1rem] hidden h-px bg-ink/20 md:block" aria-hidden />
            <ol className="relative grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-7 md:gap-2">
              {philosophy.map((step, i) => (
                <li key={step} className="phil-step flex flex-col gap-3">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border text-[0.65rem] font-mono ${
                      i === philosophy.length - 1 ? 'border-transparent bg-lime text-night' : 'border-line-strong bg-surface'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display text-xl font-semibold uppercase tracking-tight md:text-lg xl:text-xl">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
