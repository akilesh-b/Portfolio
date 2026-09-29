import { useRef } from 'react'
import { MapPin, Mouse } from 'lucide-react'
import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/gsap'
import { heroScroll } from '../lib/motionState'
import { connectLink } from '../lib/constants'
import { heroStats } from '../data/content'
import { useLenis } from '../hooks/useLenis'
import nameTexture from '../assets/images/name-texture.webp'
import { Button } from './ui/Button'
import { Counter } from './ui/Counter'
import { HeroPortrait } from './HeroPortrait'
import { HeroSocials } from './hero/HeroSocials'
import { HeroTools } from './hero/HeroTools'

const NAME = 'AKILESH'

function ScriptMotto({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none font-script leading-[0.95] text-lime/85 ${className ?? ''}`} aria-hidden>
      <div>Build</div>
      <div className="pl-[0.9em]">Explore</div>
      <div className="pl-[1.8em]">Innovate</div>
    </div>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const portrait = useRef<HTMLDivElement>(null)
  const portraitMobile = useRef<HTMLDivElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const { scrollTo } = useLenis()

  /* ---------------- intro timeline ---------------- */
  useGSAP(
    () => {
      if (window.matchMedia(MQ.reduce).matches) return
      const q = gsap.utils.selector(root)
      const portraits = [portrait.current, portraitMobile.current]

      gsap.set(q('.intro-line'), { yPercent: 110 })
      gsap.set(q('.name-char'), { yPercent: 105 })
      gsap.set(q('[data-intro="fade"]'), { autoAlpha: 0, y: 24 })
      gsap.set(q('[data-intro="btn"]'), { autoAlpha: 0, y: 20, scale: 0.96 })
      gsap.set(portraits, { autoAlpha: 0, scale: 1.06, y: 40 })
      gsap.set(q('.hero-service'), { autoAlpha: 0, x: 40 })
      gsap.set(q('.hero-tool'), { autoAlpha: 0, y: 12 })

      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: 'expo.out' } })
        .to(q('.intro-hello'), { yPercent: 0, duration: 0.9 })
        .to(q('.name-char'), { yPercent: 0, duration: 1.1, stagger: 0.045 }, 0.08)
        .to(portraits, { autoAlpha: 1, scale: 1, y: 0, duration: 1.4 }, 0.2)
        .to(q('.intro-role-1'), { yPercent: 0, duration: 0.9 }, 0.45)
        .to(q('.intro-role-2'), { yPercent: 0, duration: 0.9 }, 0.55)
        .to(q('[data-intro="fade"]'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.7)
        .to(q('.hero-service'), { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.07 }, 0.75)
        .to(q('[data-intro="btn"]'), { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.08 }, 0.85)
        .to(q('.hero-tool'), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.04 }, 1.05)
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (ready) intro.current?.play()
    },
    { dependencies: [ready], scope: root },
  )

  /* ---------------- scroll transformation ---------------- */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()

      mm.add(MQ.desktop, () => {
        // 'bottom bottom' keeps this safe if the hero is ever taller than the viewport.
        ScrollTrigger.create({ trigger: root.current, start: 'bottom bottom', end: 'bottom top', pin: true, pinSpacing: false })

        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
              onUpdate: (st) => (heroScroll.progress = st.progress),
            },
          })
          .to(q('[data-scroll-text]'), { y: (i) => -60 - i * 28, autoAlpha: 0.1 }, 0)
          .to(portrait.current, { scale: 1.1, xPercent: -8, yPercent: 5 }, 0)
          .to(q('.hero-service'), { x: (i) => 90 + i * 20, autoAlpha: 0 }, 0)
          .to(q('.hero-float'), { y: -80, autoAlpha: 0 }, 0)
          .to(q('.hero-dim'), { autoAlpha: 0.75 }, 0)
      })

      mm.add(MQ.mobile, () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.5, onUpdate: (st) => (heroScroll.progress = st.progress) },
          })
          .to(portraitMobile.current, { scale: 1.06, yPercent: -4 }, 0)
      })
    },
    { scope: root },
  )

  return (
    <section
      id="home"
      ref={root}
      aria-label="Introduction"
      className="tone-dark relative isolate overflow-hidden bg-night pb-[var(--radius-section)] text-[#F4F4EF] lg:pb-0 lg:h-[calc(max(100svh,860px)+var(--radius-section))]"
    >
      {/* ---------- atmosphere ---------- */}
      {/* corner HUD brackets */}
      <div className="pointer-events-none absolute inset-6 -z-[6] hidden lg:block" aria-hidden>
        {['left-0 top-16 border-l border-t', 'right-0 top-16 border-r border-t', 'left-0 bottom-[calc(58px+var(--radius-section))] border-l border-b', 'right-0 bottom-[calc(58px+var(--radius-section))] border-r border-b'].map((c) => (
          <span key={c} className={`absolute h-5 w-5 border-lime/40 ${c}`} />
        ))}
      </div>

      {/* ---------- desktop composition ---------- */}
      <div ref={portrait} className="absolute bottom-[calc(58px+var(--radius-section))] left-[49%] top-[10%] z-10 hidden w-[42%] origin-bottom lg:block xl:left-[45%] xl:w-[31%]">
        <HeroPortrait className="h-full w-full" ghost={false} tall />
      </div>

      <div className="hero-float absolute left-[47%] top-[15%] z-20 hidden -rotate-[18deg] text-[clamp(1.5rem,2vw,2.2rem)] lg:block xl:left-[44%]" data-intro="fade">
        <ScriptMotto />
      </div>
      <div className="hero-float micro absolute left-[50%] top-[58%] z-20 hidden items-start gap-2 xl:left-[46%] text-[0.58rem] leading-relaxed text-white/70 lg:flex" data-intro="fade">
        <span className="grid h-6 w-6 place-items-center rounded-full border border-white/25">
          <MapPin size={11} />
        </span>
        <span>
          Coimbatore,
          <br />
          India
        </span>
      </div>

      <HeroSocials className="absolute right-[5.5rem] top-[15%] z-20 hidden w-[clamp(245px,18vw,275px)] xl:flex 2xl:right-[6.5rem]" />

      {/* dim layer that deepens as the next section slides over */}
      <div className="hero-dim pointer-events-none absolute inset-0 z-30 bg-black opacity-0" aria-hidden />

      {/* ---------- copy (both layouts) ---------- */}
      {/* the full-width wrapper must not block clicks on the absolutely positioned cards */}
      <div className="container-x relative z-20 pb-10 pt-28 md:pt-32 lg:pointer-events-none lg:pb-0 lg:pt-[7.5rem]">
        <div className="lg:pointer-events-auto lg:max-w-[44%]">
          <div data-intro="fade" data-scroll-text className="micro mb-6 flex items-start gap-3 text-[0.62rem] text-white/60">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
            <span>
              AI Engineer
              <br />
              Portfolio
              <span className="mt-2 block h-px w-5 bg-white/30" aria-hidden />
            </span>
          </div>

          <p data-scroll-text className="overflow-hidden text-xs font-medium uppercase tracking-[0.42em] text-white/70 md:text-sm lg:pl-[4.5rem]">
            <span className="intro-line intro-hello flex items-center gap-4">
              Hello, I'm <span className="h-px w-8 bg-white/40" aria-hidden />
            </span>
          </p>

          <h1 data-scroll-text aria-label="Akilesh" className="mt-2 overflow-hidden pb-[0.04em] font-poster text-[25vw] uppercase leading-[0.9] tracking-[0.005em] md:text-[19vw] lg:text-[clamp(7rem,12.2vw,12.5rem)]">
            <span className="flex" aria-hidden>
              {NAME.split('').map((c, i) => (
                <span
                  key={i}
                  className="name-char inline-block bg-clip-text text-transparent will-change-transform [-webkit-background-clip:text]"
                  style={{ backgroundImage: `url(${nameTexture})`, backgroundSize: 'auto 100%', backgroundPosition: `${(i / (NAME.length - 1)) * 100}% 50%` }}
                >
                  {c}
                </span>
              ))}
            </span>
          </h1>

          <p data-scroll-text className="mt-1 font-display text-[clamp(2.1rem,9vw,3rem)] font-medium uppercase leading-[1] tracking-[-0.02em] md:text-6xl lg:text-[clamp(2.4rem,3.6vw,3.6rem)]">
            <span className="block overflow-hidden">
              <span className="intro-line intro-role-1 block">
                <span className="text-lime">AI</span> Engineer
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="intro-line intro-role-2 block">&amp; Builder</span>
            </span>
          </p>

          <p data-intro="fade" data-scroll-text className="mt-5 max-w-md text-base leading-relaxed text-white/75 md:text-lg lg:max-w-[27rem]">
            I build intelligent systems, products and digital experiences that solve real problems.
          </p>

          <div data-scroll-text className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <span data-intro="btn">
              <Button onClick={() => scrollTo('#about')} arrow="down" className="w-full text-[0.95rem] normal-case tracking-normal sm:w-auto">
                Explore More
              </Button>
            </span>
            <span data-intro="btn">
              <Button href={connectLink} external variant="ghost" className="w-full text-[0.95rem] normal-case tracking-normal sm:w-auto">
                Let's Connect
              </Button>
            </span>
          </div>

          {/* ---------- mobile / tablet portrait ---------- */}
          <div className="relative isolate -mx-[var(--gutter)] mt-10 h-[min(118vw,640px)] md:h-[min(80vw,720px)] lg:hidden">
            <div ref={portraitMobile} className="absolute inset-0 origin-bottom">
              <HeroPortrait className="h-full w-full" ghost={false} />
            </div>
            <ScriptMotto className="absolute left-[6%] top-[6%] -rotate-[16deg] text-2xl md:text-4xl" />
            <div className="micro absolute right-[6%] top-[10%] flex items-center gap-2 text-[0.55rem] text-white/70">
              <MapPin size={11} /> Coimbatore, India
            </div>
          </div>

          {/* stats */}
          <dl data-intro="fade" data-scroll-text className="mt-8 grid grid-cols-2 gap-y-6 border-t border-white/10 pt-6 sm:grid-cols-4 lg:mt-9 lg:border-t-0 lg:pt-0">
            {heroStats.map((s, i) => (
              <div key={s.label} className={`flex flex-col gap-1 px-1 sm:px-5 ${i > 0 ? 'sm:border-l sm:border-white/15' : 'sm:pl-0'} ${i % 2 ? 'border-l border-white/15 pl-5 sm:pl-5' : ''}`}>
                <dt className="micro order-2 text-[0.58rem] text-white/55">{s.label}</dt>
                <dd className="order-1 font-display text-3xl font-medium tracking-tight">
                  {ready ? <Counter stat={s} delay={1 + i * 0.1} trigger="now" /> : s.value !== undefined ? '00' : s.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- mobile / tablet stack ---------- */}
        <div className="mt-12 lg:hidden">
          <HeroSocials className="md:max-w-sm" />
        </div>
      </div>

      {/* scroll cue */}
      <button
        type="button"
        onClick={() => scrollTo('#about')}
        data-intro="fade"
        className="micro group absolute bottom-[calc(80px+var(--radius-section))] left-[var(--gutter)] z-20 hidden items-center gap-3 text-[0.56rem] text-white/55 hover:text-lime lg:flex"
        aria-label="Scroll to next section"
      >
        <span className="grid h-11 w-7 place-items-center rounded-full border border-white/40 transition-colors group-hover:border-lime">
          <Mouse size={13} className="animate-bounce" />
        </span>
        <span className="leading-relaxed">
          Scroll
          <br />
          to explore
        </span>
      </button>

      <HeroTools className="relative z-20 lg:absolute lg:inset-x-0 lg:bottom-[var(--radius-section)]" />
    </section>
  )
}
