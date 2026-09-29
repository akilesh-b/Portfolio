# AKI — Akilesh Portfolio

Cinematic single-page portfolio · React 19 + TypeScript + Vite · Tailwind v4 · GSAP/ScrollTrigger · Lenis · Three.js / React Three Fiber · Framer Motion.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build → dist/
npm run preview   # serve the production build
```

## Where to change things

| What | File |
| --- | --- |
| GitHub, LinkedIn, X, Medium, **email** | `src/lib/constants.ts` → `socialLinks` |
| "View all experiments" link (AI Lab) | `src/lib/constants.ts` → `projectLinks` |
| "Let's connect" destination | `src/lib/constants.ts` → `connectLink` |
| Domain for SEO / Open Graph | `index.html` (canonical, og:url, og:image) + `SITE_URL` in `constants.ts` |
| Articles (titles, dates, links) | `src/data/articles.ts` |
| Journey timeline | `src/data/journey.ts` |
| Tech stack + hover labels | `src/data/technologies.ts` |
| Hero focus cards, tools strip, AI Lab, stats | `src/data/content.ts` |
| Colours / fonts / tokens | `src/index.css` (`:root`, `.tone-dark`, `.tone-light`, `@theme`) |

### Portrait

- `src/assets/images/portrait-cutout.webp`: transparent cutout used in the hero, loader and journey card
- `src/assets/images/portrait.webp`: the original photo used in the About frame
- `public/og-image.jpg`: the social share image

To swap the photo, replace both files and keep the same names. The cutout was made with `rembg` (isnet-general-use), which removes the background and leaves the face untouched.

## Architecture

```
src/
  components/           Navbar, Hero, HeroPortrait, hero/ (Services, Landscape, Tools),
                        About, TechStack, Journey, AILab, Writing, Contact, Footer,
                        CustomCursor, PageProgress, Loader, MobileMenu, SectionHeader, …
  components/animations FadeUp, RevealText, Parallax
  components/visuals    OrbScene (Three.js, lazy), OrbFallback (2D canvas), OrbStage (chooser),
                        ArticleArt
  components/ui         Button (magnetic), Counter, BrandIcon
  data/                 technologies, journey, articles, content
  hooks/                useLenis, useMediaQuery, useReducedMotion, useActiveSection, useInView
  lib/                  animations (fadeUp, fadeIn, splitTextReveal, imageReveal, scaleReveal,
                        horizontalScroll, parallax, staggerReveal), gsap, constants, motionState
  pages/Home.tsx
```

## Performance and accessibility notes

- **Three.js is code-split.** It is only downloaded on desktop when WebGL is available. Mobile, no-WebGL and reduced-motion visitors get a lightweight 2D canvas orb instead. Render loops pause when a scene is off-screen.
- **Reduced motion is respected.** With `prefers-reduced-motion`, Lenis, scroll scrubbing, the intro timeline and decorative loops are all turned off.
- **The custom cursor only adds to the native one.** It runs on fine pointers only and never hides the system cursor.
