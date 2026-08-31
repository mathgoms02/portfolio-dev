/**
 * Baked snapshot of github.com/mathgoms02, captured 2026-08-31.
 *
 * The site fetches live numbers from the public GitHub API on load; this is the
 * fallback that renders instantly and keeps the page truthful when the API is
 * rate-limited, offline, or blocked. Regenerate with: npm run sync:github
 */
export interface GithubLanguage {
  name: string
  pct: number
  color: string
}

export interface GithubStats {
  login: string
  name: string
  followers: number
  publicRepos: number
  memberSince: string
  commitsLastYear: number
  pullRequests: number
  reposContributed: number
  contributionsLastYear: number
  /** ISO date of calendar[0] */
  calendarStart: string
  /** one contribution count per day, oldest first */
  calendar: number[]
  languages: GithubLanguage[]
  capturedAt: string
  live: boolean
}

export const githubSnapshot: GithubStats = {
  login: 'mathgoms02',
  name: 'Matheus Gomes',
  followers: 14,
  publicRepos: 37,
  memberSince: '2023-05-21',
  commitsLastYear: 290,
  pullRequests: 26,
  reposContributed: 18,
  contributionsLastYear: 916,
  calendarStart: '2025-08-31',
  calendar: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,1,1,1,1,1,1,2,1,1,1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,2,0,0,0,6,9,3,0,0,1,0,3,0,3,1,1,0,0,13,0,1,1,1,0,0,15,10,4,5,10,2,0,7,3,5,3,0,4,4,12,5,4,1,0,4,1,1,1,2,3,0,3,0,2,1,0,1,8,11,24,8,26,10,0,1,7,21,13,0,15,0,2,0,18,9,15,4,4,1,0,0,11,15,13,19,2,0,0,7,3,5,0,0,0,0,12,5,3,0,3,0,2,23,3,17,37,19,11,0,31,8,6,6,6,0,0,23,24,0,5,11,12,3,12,5,16,23,4,7,5,34,46,2,0,0,0,0,30,0,0,0,0,0,0,0],
  languages: [
    { name: 'Python', pct: 30.3, color: '#3572A5' },
    { name: 'TypeScript', pct: 29.4, color: '#3178c6' },
    { name: 'Java', pct: 14.6, color: '#b07219' },
    { name: 'JavaScript', pct: 11, color: '#f1e05a' },
    { name: 'CSS', pct: 6.9, color: '#663399' },
    { name: 'HTML', pct: 6.4, color: '#e34c26' },
    { name: 'C++', pct: 0.8, color: '#f34b7d' },
    { name: 'Processing', pct: 0.3, color: '#0096D8' },
  ],
  capturedAt: '2026-08-31',
  live: false,
}
