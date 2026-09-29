import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { siGithub, siInstagram, siMedium } from 'simple-icons'
import { socialLinks } from '../../lib/constants'
import { BrandIcon, linkedinPath } from '../ui/BrandIcon'

/**
 * Right-hand hero panel: a live GitHub contribution graph plus Medium,
 * LinkedIn and Instagram cards. Contributions come from a public mirror of the
 * GitHub calendar; if it can't be reached a placeholder pattern is shown.
 */

const WEEKS = 20
const CONTRIB_API = 'https://github-contributions-api.jogruber.de/v4/'
const LEVEL_BG = ['rgb(255 255 255 / 0.06)', 'rgb(223 255 79 / 0.25)', 'rgb(223 255 79 / 0.45)', 'rgb(223 255 79 / 0.7)', 'rgb(223 255 79)']

interface Day {
  date: string
  count: number
  level: number
}

const githubUser = socialLinks.github.replace(/\/+$/, '').split('/').pop() ?? ''

function placeholder(): Day[] {
  return Array.from({ length: WEEKS * 7 }, (_, i) => {
    const level = Math.max(0, Math.round(Math.abs(Math.sin(i * 1.31) * Math.cos(i * 0.47)) * 5) - 1)
    return { date: '', count: level, level }
  })
}

/** Current streak: consecutive days with commits, ending today (or yesterday). */
function streakOf(days: Day[]) {
  let i = days.length - 1
  if (i >= 0 && days[i].count === 0) i-- // today may not have commits yet
  let n = 0
  while (i >= 0 && days[i].count > 0) {
    n++
    i--
  }
  return n
}

function GitHubCard() {
  const [days, setDays] = useState<Day[] | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    if (!githubUser) return
    const ctrl = new AbortController()
    fetch(`${CONTRIB_API}${githubUser}?y=last`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { total: { lastYear: number }; contributions: Day[] }) => {
        const today = new Date().toISOString().slice(0, 10)
        const all = d.contributions.filter((c) => c.date <= today)
        const lastDow = new Date(`${all[all.length - 1].date}T00:00:00`).getDay()
        setDays(all.slice(-((WEEKS - 1) * 7 + lastDow + 1)))
        setTotal(d.total.lastYear)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  const cells = days ?? placeholder()
  const streak = days ? streakOf(days) : null

  return (
    <a
      href={socialLinks.github}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      className="hero-service group block rounded-2xl border border-white/10 bg-[#0d0f0d]/80 p-4 backdrop-blur-md transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-x-1 hover:border-lime/40"
    >
      <span className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[#F4F4EF] transition-colors group-hover:border-lime/40 group-hover:text-lime">
          <BrandIcon icon={siGithub} size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-[#F4F4EF]">GitHub</span>
          <span className="micro block truncate text-[0.56rem] text-white/45">@{githubUser}</span>
        </span>
        <ArrowUpRight size={16} className="shrink-0 text-lime transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </span>

      <span className="mt-3.5 grid grid-flow-col grid-rows-7 gap-[3px]" aria-hidden>
        {cells.map((d, i) => (
          <span
            key={i}
            title={d.date ? `${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}` : undefined}
            className="aspect-square w-full rounded-[2px]"
            style={{ background: LEVEL_BG[d.level] }}
          />
        ))}
      </span>

      <span className="micro mt-3 flex items-center justify-between text-[0.52rem] text-white/45">
        <span>
          <span className="text-[#F4F4EF]">{total ?? '—'}</span> commits / yr
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
          <span className="text-[#F4F4EF]">{streak ?? '—'}</span> day streak
        </span>
      </span>
    </a>
  )
}

const linkedinIcon = (
  <svg viewBox="0 0 24 24" width={17} height={17} fill="currentColor" aria-hidden>
    <path d={linkedinPath} />
  </svg>
)

const socials = [
  { key: 'medium', title: 'Medium', sub: 'AI & dev articles', href: socialLinks.medium, icon: <BrandIcon icon={siMedium} size={18} /> },
  { key: 'linkedin', title: 'LinkedIn', sub: "Let's connect", href: socialLinks.linkedin, icon: linkedinIcon },
  { key: 'instagram', title: 'Instagram', sub: 'Behind the scenes', href: socialLinks.instagram, icon: <BrandIcon icon={siInstagram} size={17} /> },
].filter((s) => s.href)

export function HeroSocials({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2.5 ${className ?? ''}`}>
      <GitHubCard />
      <ul className="flex flex-col gap-2.5" aria-label="Social profiles">
        {socials.map((s) => (
          <li key={s.key} className="hero-service">
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-[#0d0f0d]/80 px-4 py-3 backdrop-blur-md transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-x-1 hover:border-lime/40"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[#F4F4EF] transition-colors group-hover:border-lime/40 group-hover:text-lime">
                {s.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[0.82rem] font-semibold uppercase tracking-[0.06em] text-[#F4F4EF]">{s.title}</span>
                <span className="micro block truncate text-[0.56rem] text-white/45">{s.sub}</span>
              </span>
              <ArrowUpRight size={16} className="shrink-0 text-lime transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
