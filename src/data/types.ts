export type Locale = 'pt' | 'en'

/** A value that exists in both locales. */
export type L<T = string> = Record<Locale, T>

export interface Link {
  label: string
  href: string
  handle?: string
}

export interface Metric {
  id: string
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  label: L
  note?: L
}

export interface Role {
  id: string
  company: string
  companyNote?: L
  title: L
  kind: L
  start: string          // YYYY-MM
  end: string | null     // null = present
  location: string | L
  remote?: boolean
  bullets: L<string[]>
  stack: string[]
  accent?: boolean
}

export type ProjectStatus = 'live' | 'active' | 'shipped' | 'research' | 'archived'

export interface Project {
  id: string
  repo?: string                 // owner/name on GitHub
  index: string                 // display number, e.g. "001"
  name: string
  year: string
  status: ProjectStatus
  role: L
  tagline: L
  summary: L
  problem?: L
  approach?: L<string[]>
  outcome?: L<string[]>
  stack: string[]
  links: { label: L; href: string; kind: 'repo' | 'demo' | 'video' | 'site' }[]
  /** Why there is no public link — shown in place of the repository row. */
  restricted?: L
  tint?: string                 // accent hue for the case sheet
}

export interface LabItem {
  repo: string
  name: string
  year: string
  note: L
  tags: string[]
}

export interface Achievement {
  id: string
  at: string
  headline: L
  detail: L
  figure: string
  figureNote: L
}

export interface StackGroup {
  id: string
  label: L
  items: { name: string; level?: 1 | 2 | 3; note?: L }[]
}

export interface EventItem {
  id: string
  name: L
  org: string
  year: string
  detail: L
}

export interface Course {
  name: L
  provider?: string
}
