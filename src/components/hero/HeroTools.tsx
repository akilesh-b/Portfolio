import { heroTools } from '../../data/content'
import { useLenis } from '../../hooks/useLenis'
import { BrandIcon } from '../ui/BrandIcon'

/** "Tools & technologies I work with" strip along the bottom of the hero. */
export function HeroTools({ className }: { className?: string }) {
  const { scrollTo } = useLenis()
  return (
    <div className={`border-t border-white/10 bg-[#080908]/70 backdrop-blur-md ${className ?? ''}`}>
      <div className="container-x flex items-center gap-6 py-4 lg:gap-8">
        <p className="micro hidden shrink-0 text-[0.58rem] text-white/45 md:block">Tools &amp; technologies I work with</p>
        <ul className="no-scrollbar flex flex-1 items-center gap-6 overflow-x-auto lg:justify-between lg:gap-4" aria-label="Tools and technologies">
          {heroTools.map((t) => (
            <li key={t.name} className="hero-tool flex shrink-0 items-center gap-2 text-[0.78rem] text-white/75">
              {/* near-black brand colours (e.g. Three.js) would vanish on the dark strip */}
              <BrandIcon icon={t.icon} brand={t.icon.hex !== '000000'} size={17} className="text-[#F4F4EF] drop-shadow-[0_0_6px_rgb(255_255_255/0.15)]" />
              {t.name}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => scrollTo('#stack')}
          className="micro hidden shrink-0 border-l border-white/10 pl-6 text-[0.58rem] text-white/45 transition-colors hover:text-lime sm:block"
          data-cursor="link"
        >
          And more…
        </button>
      </div>
    </div>
  )
}
