import { Mail } from 'lucide-react'
import { siGithub, siMedium, siX } from 'simple-icons'
import { socialLinks } from '../lib/constants'
import { BrandIcon, linkedinPath } from './ui/BrandIcon'

const items = [
  { key: 'github', label: 'GitHub', href: socialLinks.github, icon: <BrandIcon icon={siGithub} size={17} /> },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: socialLinks.linkedin,
    icon: (
      <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
        <path d={linkedinPath} />
      </svg>
    ),
  },
  { key: 'x', label: 'X (Twitter)', href: socialLinks.x, icon: <BrandIcon icon={siX} size={15} /> },
  { key: 'medium', label: 'Medium', href: socialLinks.medium, icon: <BrandIcon icon={siMedium} size={17} /> },
  { key: 'email', label: 'Email', href: socialLinks.email ? `mailto:${socialLinks.email}` : '', icon: <Mail size={17} aria-hidden /> },
].filter((i) => i.href)

export function SocialLinks({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'h-10 w-10' : 'h-12 w-12'
  return (
    <ul className="flex items-center gap-2" aria-label="Social profiles">
      {items.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            aria-label={s.label}
            {...(s.key !== 'email' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`${box} grid place-items-center rounded-full border border-line-strong text-ink transition-all duration-300 hover:-translate-y-1 hover:border-lime hover:bg-lime hover:text-night`}
            data-cursor="link"
          >
            {s.icon}
          </a>
        </li>
      ))}
    </ul>
  )
}
