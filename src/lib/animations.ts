import { gsap } from './gsap'

/**
 * Reusable scroll-driven animation primitives.
 * All of them animate transform / opacity / clip-path only, and all of them
 * are meant to be called inside a gsap.context / useGSAP scope so they are
 * reverted automatically on unmount.
 */

type Target = gsap.TweenTarget
type Trigger = Element | string | null | undefined

interface RevealOpts {
  trigger?: Trigger
  delay?: number
  start?: string
  stagger?: number
  distance?: number
  duration?: number
}

const reveal = (trigger: Trigger, start = 'top 85%') => ({
  trigger: trigger ?? undefined,
  start,
  toggleActions: 'play none none reverse',
})

export function fadeUp(target: Target, o: RevealOpts = {}) {
  return gsap.from(target, {
    y: o.distance ?? 48,
    autoAlpha: 0,
    duration: o.duration ?? 1,
    delay: o.delay,
    stagger: o.stagger ?? 0,
    ease: 'expo.out',
    scrollTrigger: reveal(o.trigger ?? (target as Element), o.start),
  })
}

export function fadeIn(target: Target, o: RevealOpts = {}) {
  return gsap.from(target, {
    autoAlpha: 0,
    duration: o.duration ?? 1.2,
    delay: o.delay,
    stagger: o.stagger ?? 0,
    ease: 'power2.out',
    scrollTrigger: reveal(o.trigger ?? (target as Element), o.start),
  })
}

/** Reveals `.line-inner` children (see <RevealText/>) from a clipping mask. */
export function splitTextReveal(root: Element, o: RevealOpts = {}) {
  const lines = root.querySelectorAll('.line-inner')
  return gsap.from(lines, {
    yPercent: 110,
    rotate: 2,
    duration: o.duration ?? 1.1,
    delay: o.delay,
    stagger: o.stagger ?? 0.08,
    ease: 'expo.out',
    scrollTrigger: reveal(o.trigger ?? root, o.start),
  })
}

export function imageReveal(target: Element, o: RevealOpts = {}) {
  const tl = gsap.timeline({ scrollTrigger: reveal(o.trigger ?? target, o.start) })
  tl.fromTo(
    target,
    { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
    { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: o.duration ?? 1.3, ease: 'expo.inOut' },
  )
  const img = target.querySelector('img')
  if (img) tl.from(img, { scale: 1.25, duration: 1.6, ease: 'expo.out' }, 0)
  return tl
}

export function scaleReveal(target: Target, o: RevealOpts = {}) {
  return gsap.from(target, {
    scale: 0.88,
    autoAlpha: 0,
    duration: o.duration ?? 1.1,
    delay: o.delay,
    stagger: o.stagger ?? 0,
    ease: 'expo.out',
    scrollTrigger: reveal(o.trigger ?? (target as Element), o.start),
  })
}

export function staggerReveal(targets: Target, o: RevealOpts = {}) {
  return gsap.from(targets, {
    y: o.distance ?? 36,
    autoAlpha: 0,
    duration: o.duration ?? 0.9,
    stagger: o.stagger ?? 0.07,
    ease: 'expo.out',
    scrollTrigger: reveal(o.trigger, o.start ?? 'top 80%'),
  })
}

/** Scroll-scrubbed vertical drift. `speed` > 0 moves slower than the page. */
export function parallax(target: Element, speed = 0.15, trigger?: Trigger) {
  return gsap.fromTo(
    target,
    { yPercent: -speed * 100 },
    {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: trigger ?? target, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  )
}

/** Moves a wide track horizontally while its section scrolls past (no pinning). */
export function horizontalScroll(track: HTMLElement, trigger: Element, amount = 0.25) {
  return gsap.fromTo(
    track,
    { xPercent: amount * 50 },
    {
      xPercent: -amount * 50,
      ease: 'none',
      scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    },
  )
}
