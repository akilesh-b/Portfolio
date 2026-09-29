import { useRef } from 'react'
import { ArrowUpRight, Clock } from 'lucide-react'
import { articles } from '../data/articles'
import { socialLinks } from '../lib/constants'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { horizontalScroll } from '../lib/animations'
import { SectionHeader } from './SectionHeader'
import { ArticleArt } from './visuals/ArticleArt'

export function Writing() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.matchMedia().add(MQ.motion, () => {
        if (track.current) horizontalScroll(track.current, root.current!, 0.3)
        gsap.from(q('.article-card'), { y: 70, autoAlpha: 0, stagger: 0.12, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: q('.article-grid')[0], start: 'top 85%' } })
      })
    },
    { scope: root },
  )

  return (
    <section id="writing" ref={root} aria-label="Writing" className="tone-light section-card z-[70] overflow-hidden pb-24 pt-24 md:pb-32 md:pt-32">
      {/* drifting editorial word */}
      <div
        ref={track}
        className="display-tight text-outline pointer-events-none absolute left-0 top-16 whitespace-nowrap text-[22vw] font-bold uppercase leading-none opacity-60 md:top-10"
        aria-hidden
      >
        Thoughts · Learnings · Notes
      </div>

      <div className="container-x relative">
        <SectionHeader
          index="06"
          title="Writing"
          subtitle="Thoughts, learnings and experiences."
          aside={
            <a
              href={socialLinks.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-transparent hover:bg-lime hover:text-night"
              data-cursor="link"
            >
              View all posts <ArrowUpRight size={14} />
            </a>
          }
        />

        <ul className="article-grid no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {articles.map((a) => (
            <li key={a.title} className="article-card w-[82vw] shrink-0 snap-start sm:w-[60vw] md:w-auto">
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface-2 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]"
                data-cursor="link"
              >
                <div className="relative aspect-[5/3] overflow-hidden bg-night">
                  <div className="h-full w-full transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-2 group-hover:scale-110">
                    <ArticleArt kind={a.art} />
                  </div>
                  <span className="micro absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[0.55rem] text-white/85 backdrop-blur">{a.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold leading-snug tracking-tight md:text-2xl">{a.title}</h3>
                  <p className="mt-3 text-[0.95rem] text-muted">{a.description}</p>
                  <div className="micro mt-auto flex items-center justify-between pt-6 text-[0.6rem] text-faint">
                    <span className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} aria-hidden /> {a.readingTime}
                      </span>
                      <span aria-hidden>·</span>
                      <time>{a.date}</time>
                    </span>
                    <span className="grid h-9 w-9 -translate-x-2 place-items-center rounded-full bg-lime text-night opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100" aria-hidden>
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
