#!/usr/bin/env node
/**
 * Regenerates src/data/github-snapshot.ts from the live GitHub API.
 *
 * The site fetches live numbers in the browser, but the snapshot is what
 * renders on the first paint and what survives a rate limit. Re-run it
 * whenever the numbers drift:  npm run sync:github
 *
 * Requires the GitHub CLI, authenticated:  gh auth status
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const USER = 'mathgoms02'
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/github-snapshot.ts')

const gh = (query) =>
  JSON.parse(execFileSync('gh', ['api', 'graphql', '-f', `query=${query}`], { encoding: 'utf8' }))

const profile = gh(`{
  user(login: "${USER}") {
    login name
    followers { totalCount }
    repositories(privacy: PUBLIC) { totalCount }
    createdAt
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalRepositoriesWithContributedCommits
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`).data.user

const repos = gh(`{
  user(login: "${USER}") {
    repositories(first: 100, privacy: PUBLIC, isFork: false, ownerAffiliations: OWNER) {
      nodes { languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
        edges { size node { name color } }
      } }
    }
  }
}`).data.user.repositories.nodes

const cc = profile.contributionsCollection
const days = cc.contributionCalendar.weeks.flatMap((w) => w.contributionDays)

const bytes = new Map()
const colors = new Map()
for (const repo of repos) {
  for (const edge of repo.languages.edges) {
    bytes.set(edge.node.name, (bytes.get(edge.node.name) ?? 0) + edge.size)
    colors.set(edge.node.name, edge.node.color)
  }
}
// Notebooks embed their rendered output, which wildly inflates their byte count.
bytes.delete('Jupyter Notebook')

const totalBytes = [...bytes.values()].reduce((a, b) => a + b, 0)
const languages = [...bytes.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([name, size]) => ({ name, pct: Math.round((size / totalBytes) * 1000) / 10, color: colors.get(name) }))
  .filter((l) => l.pct >= 0.3)
  .slice(0, 8)

const capturedAt = new Date().toISOString().slice(0, 10)

writeFileSync(
  OUT,
  `/**
 * Baked snapshot of github.com/${USER}, captured ${capturedAt}.
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
  login: '${profile.login}',
  name: '${profile.name}',
  followers: ${profile.followers.totalCount},
  publicRepos: ${profile.repositories.totalCount},
  memberSince: '${profile.createdAt.slice(0, 10)}',
  commitsLastYear: ${cc.totalCommitContributions},
  pullRequests: ${cc.totalPullRequestContributions},
  reposContributed: ${cc.totalRepositoriesWithContributedCommits},
  contributionsLastYear: ${cc.contributionCalendar.totalContributions},
  calendarStart: '${days[0].date}',
  calendar: [${days.map((d) => d.contributionCount).join(',')}],
  languages: [
${languages.map((l) => `    { name: '${l.name}', pct: ${l.pct}, color: '${l.color}' },`).join('\n')}
  ],
  capturedAt: '${capturedAt}',
  live: false,
}
`,
)

console.log(
  `github-snapshot.ts updated — ${cc.contributionCalendar.totalContributions} contributions, ` +
    `${profile.repositories.totalCount} repos, ${languages.length} languages`,
)
