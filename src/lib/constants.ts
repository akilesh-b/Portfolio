/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit this file to personalise the site.
 *  Every external link used anywhere in the app lives here.
 * ─────────────────────────────────────────────────────────────
 */

export const SITE_URL = 'https://akilesh.dev'

export const profile = {
  name: 'Akilesh',
  fullName: 'Akilesh Balamurugan',
  short: 'AKI',
  role: 'AI Engineer & Builder',
  tagline: 'AI ENGINEER × BUILDER × EXPLORER',
  location: 'Coimbatore, India',
  education: 'B.E. Computer Science Engineering',
  institution: 'KGiSL Institute of Technology',
  period: '2024 — 2028',
  languages: ['English', 'Tamil'],
  available: true,
} as const

/** Social profiles. Leave a value as '' to hide that icon. */
export const socialLinks = {
  github: 'https://github.com/akilesh-b',
  linkedin: 'https://www.linkedin.com/in/your-linkedin-id', // ← replace
  x: 'https://x.com/your-handle', // ← replace
  medium: 'https://medium.com/@your-handle', // ← replace
  instagram: 'https://www.instagram.com/your-handle', // ← replace
  email: 'your.email@example.com', // ← replace (plain address, no "mailto:")
} as const

export const mailto = (subject = "Let's build something") =>
  `mailto:${socialLinks.email}?subject=${encodeURIComponent(subject)}`

/** Project / repository links — replace with live demos when available. */
export const projectLinks = {
  allProjects: 'https://github.com/akilesh-b?tab=repositories',
} as const

/** Primary "connect" destination used by the navbar / hero CTA. */
export const connectLink = socialLinks.linkedin

export type SectionId =
  | 'home'
  | 'about'
  | 'stack'
  | 'journey'
  | 'lab'
  | 'writing'
  | 'contact'

export const sections: { id: SectionId; index: string; label: string }[] = [
  { id: 'home', index: '01', label: 'Home' },
  { id: 'about', index: '02', label: 'About' },
  { id: 'stack', index: '03', label: 'Tech Stack' },
  { id: 'journey', index: '04', label: 'Journey' },
  { id: 'lab', index: '05', label: 'AI Lab' },
  { id: 'writing', index: '06', label: 'Writing' },
  { id: 'contact', index: '07', label: 'Contact' },
]

/** Navigation items map onto sections (several sections share one nav tab). */
export const navItems: { label: string; target: SectionId; covers: SectionId[] }[] = [
  { label: 'Home', target: 'home', covers: ['home'] },
  { label: 'About', target: 'about', covers: ['about', 'stack', 'journey'] },
  { label: 'Lab', target: 'lab', covers: ['lab'] },
  { label: 'Blogs', target: 'writing', covers: ['writing'] },
  { label: 'Contact', target: 'contact', covers: ['contact'] },
]
