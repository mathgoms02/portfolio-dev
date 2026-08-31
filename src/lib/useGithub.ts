import { useEffect, useState } from 'react'
import { githubSnapshot, type GithubStats } from '../data/github-snapshot'

const USER = 'mathgoms02'
const CACHE_KEY = 'mg.gh.v2'
const CACHE_TTL = 6 * 60 * 60 * 1000 // six hours — well inside the 60 req/h budget

export interface RepoMeta {
  name: string
  full: string
  url: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  pushedAt: string
  topics: string[]
}

export type Provenance = 'snapshot' | 'cache' | 'live'

export interface GithubData {
  stats: GithubStats
  /** keyed by `owner/name`, lowercased */
  repos: Record<string, RepoMeta>
  provenance: Provenance
  fetchedAt: number | null
}

interface Cached {
  at: number
  stats: GithubStats
  repos: Record<string, RepoMeta>
}

const initial: GithubData = {
  stats: githubSnapshot,
  repos: {},
  provenance: 'snapshot',
  fetchedAt: null,
}

function readCache(): Cached | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Cached
    if (!parsed?.at || Date.now() - parsed.at > CACHE_TTL) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(payload: Cached) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch {
    /* quota or private mode — the site works fine without the cache */
  }
}

async function json<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return (await res.json()) as T
}

interface ApiUser {
  followers: number
  public_repos: number
  created_at: string
  name: string | null
}

interface ApiRepo {
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  pushed_at: string
  topics?: string[]
  fork: boolean
}

interface ContribApi {
  total: Record<string, number>
  contributions: { date: string; count: number }[]
}

/**
 * Live GitHub numbers layered over the baked snapshot.
 *
 * The snapshot renders on the first paint, so the section is never empty and
 * never wrong; live values replace it as they arrive. Every failure path — rate
 * limit, offline, blocked request — silently leaves the snapshot in place.
 */
export function useGithub(): GithubData {
  const [data, setData] = useState<GithubData>(initial)

  useEffect(() => {
    const cached = readCache()
    if (cached) {
      setData({
        stats: cached.stats,
        repos: cached.repos,
        provenance: 'cache',
        fetchedAt: cached.at,
      })
      return
    }

    const controller = new AbortController()
    const { signal } = controller

    ;(async () => {
      const [userRes, reposRes, contribRes] = await Promise.allSettled([
        json<ApiUser>(`https://api.github.com/users/${USER}`, signal),
        json<ApiRepo[]>(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, signal),
        json<ContribApi>(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, signal),
      ])

      if (signal.aborted) return

      // Nothing came back — stay on the snapshot rather than showing a broken state.
      if (
        userRes.status === 'rejected' &&
        reposRes.status === 'rejected' &&
        contribRes.status === 'rejected'
      ) {
        return
      }

      const stats: GithubStats = { ...githubSnapshot, live: true }
      const repos: Record<string, RepoMeta> = {}

      if (userRes.status === 'fulfilled') {
        stats.followers = userRes.value.followers
        stats.publicRepos = userRes.value.public_repos
        stats.memberSince = userRes.value.created_at.slice(0, 10)
      }

      if (reposRes.status === 'fulfilled') {
        for (const r of reposRes.value) {
          repos[r.full_name.toLowerCase()] = {
            name: r.name,
            full: r.full_name,
            url: r.html_url,
            description: r.description,
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language,
            pushedAt: r.pushed_at,
            topics: r.topics ?? [],
          }
        }
      }

      if (contribRes.status === 'fulfilled') {
        const days = contribRes.value.contributions
        if (Array.isArray(days) && days.length > 300) {
          const recent = days.slice(-366)
          stats.calendar = recent.map((d) => d.count)
          stats.calendarStart = recent[0].date
          stats.contributionsLastYear = recent.reduce((sum, d) => sum + d.count, 0)
        }
      }

      const at = Date.now()
      writeCache({ at, stats, repos })
      setData({ stats, repos, provenance: 'live', fetchedAt: at })
    })().catch(() => {
      /* handled above — the snapshot stands */
    })

    return () => controller.abort()
  }, [])

  return data
}
