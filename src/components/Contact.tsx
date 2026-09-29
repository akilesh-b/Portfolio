import { useRef } from 'react'
import { connectLink, mailto, profile, socialLinks } from '../lib/constants'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { RevealText } from './animations/RevealText'
import { FadeUp } from './animations/FadeUp'
import { Button } from './ui/Button'
import { SocialLinks } from './SocialLinks'
import { OrbStage } from './visuals/OrbStage'

export function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.matchMedia().add(MQ.motion, () => {
        gsap.fromTo(q('.contact-planet'), { yPercent: 18, scale: 0.85 }, { yPercent: -6, scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } })
      })
    },
    { scope: root },
  )

  return (
    <section id="contact" ref={root} aria-label="Contact" className="tone-dark section-card z-[80] flex min-h-[100svh] flex-col overflow-hidden pt-24 md:pt-32">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_60%,black,transparent_70%)]" aria-hidden />
      <div className="contact-planet pointer-events-none absolute -bottom-[20%] right-[-45%] aspect-square w-[130vw] max-w-[1100px] md:right-[-20%] md:w-[85vw] lg:-bottom-[10%] lg:right-[-8%] lg:w-[60vw]">
        <OrbStage variant="planet" className="h-full w-full" />
      </div>

      <div className="container-x relative flex flex-1 flex-col justify-center pb-16">
        <FadeUp className="micro mb-8 flex items-center gap-3 text-faint" distance={16}>
          <span className="text-accent-ink">07</span>
          <span className="h-px w-10 bg-line-strong" aria-hidden />
          <span>Let's build</span>
        </FadeUp>

        <h2 className="max-w-5xl">
          <RevealText
            as="span"
            className="block font-display text-[clamp(1.8rem,4vw,3.2rem)] font-normal uppercase tracking-tight text-muted"
            lines={['Have an idea?']}
          />
          <RevealText
            as="span"
            className="display-tight mt-3 block text-[clamp(3.2rem,11vw,10rem)] font-bold uppercase"
            stagger={0.12}
            lines={["Let's build", 'something', <span className="text-accent-ink">interesting.</span>]}
          />
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <FadeUp className="lg:col-span-5" distance={30}>
            <p className="max-w-md text-lg text-muted">I'm always open to new opportunities, collaborations and exciting projects.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={mailto()} className="w-full sm:w-auto">
                Send me an email
              </Button>
              <Button href={connectLink} external variant="ghost" className="w-full sm:w-auto">
                Let's connect
              </Button>
            </div>
            <div className="mt-10">
              <SocialLinks />
            </div>
          </FadeUp>
          <div className="relative hidden lg:col-span-7 lg:block">
            <div className="micro absolute right-[8%] top-0 flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5 text-[0.6rem] text-muted backdrop-blur">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> Available for opportunities
            </div>
            <div className="font-script absolute bottom-0 right-[4%] -rotate-6 text-6xl text-ink/60 xl:text-7xl" aria-hidden>
              Thanks for visiting
            </div>
          </div>
        </div>

        <div className="micro mt-14 flex flex-wrap gap-x-8 gap-y-2 text-[0.6rem] text-faint">
          <span>{profile.location}</span>
          <a href={`mailto:${socialLinks.email}`} className="link-underline hover:text-ink">
            {socialLinks.email}
          </a>
        </div>
      </div>
    </section>
  )
}
