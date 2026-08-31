import type { L, Locale } from '../data/types'

const MONTHS: Record<Locale, string[]> = {
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  en: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
}

/** "2024-04" → "abr 2024" / "apr 2024" */
export function monthYear(iso: string, locale: Locale): string {
  const [y, m] = iso.split('-')
  return `${MONTHS[locale][Number(m) - 1]} ${y}`
}

/** Whole months between two YYYY-MM marks; `null` end means today. */
export function monthsBetween(start: string, end: string | null): number {
  const [sy, sm] = start.split('-').map(Number)
  const now = new Date()
  const [ey, em] = end ? end.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1]
  return Math.max(0, (ey - sy) * 12 + (em - sm))
}

const duration: Record<'y' | 'm', L> = {
  y: { pt: 'a', en: 'y' },
  m: { pt: 'm', en: 'm' },
}

/** 26 → "2a 2m" / "2y 2m" */
export function durationLabel(months: number, locale: Locale): string {
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts: string[] = []
  if (y) parts.push(`${y}${duration.y[locale]}`)
  if (m || !y) parts.push(`${m}${duration.m[locale]}`)
  return parts.join(' ')
}

export function pad(n: number, size = 2): string {
  return String(n).padStart(size, '0')
}

/** "há 3 dias" / "3 days ago" — coarse, for repo freshness. */
export function relativeTime(iso: string, locale: Locale): string {
  const then = new Date(iso).getTime()
  const days = Math.floor((Date.now() - then) / 86_400_000)
  if (Number.isNaN(days)) return ''
  if (days <= 0) return locale === 'pt' ? 'hoje' : 'today'
  if (days === 1) return locale === 'pt' ? 'ontem' : 'yesterday'
  if (days < 30) return locale === 'pt' ? `há ${days} dias` : `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) {
    return locale === 'pt'
      ? `há ${months} ${months === 1 ? 'mês' : 'meses'}`
      : `${months} month${months === 1 ? '' : 's'} ago`
  }
  const years = Math.floor(months / 12)
  return locale === 'pt'
    ? `há ${years} ano${years === 1 ? '' : 's'}`
    : `${years} year${years === 1 ? '' : 's'} ago`
}

export function addDays(iso: string, days: number): Date {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}
