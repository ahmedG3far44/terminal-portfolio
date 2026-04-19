import { createContext, useContext, useState, useEffect } from 'react'

const GitHubContext = createContext(null)
const GITHUB_GRAPHQL = 'https://api.github.com/graphql'
const GITHUB_API = 'https://api.github.com'

const CONTRIBUTION_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
        totalCommitContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        totalIssueContributions
      }
    }
  }
`

const REPOS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      repositories(first: 100, ownerAffiliations: [OWNER], orderBy: {field: UPDATED_AT, direction: DESC}, isPrivate: false) {
        nodes {
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          languages(first: 5) {
            nodes {
              name
            }
          }
          defaultBranchRef {
            target {
              commitUrl
            }
          }
          updatedAt
        }
      }
    }
  }
`

async function fetchGitHub(username, token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const response = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: CONTRIBUTION_QUERY, variables: { username } })
  })

  const result = await response.json()

  if (result.errors) {
    throw new Error(result.errors[0].message)
  }

  const contribData = result.data.user.contributionsCollection
  const calendar = contribData.contributionCalendar
  const days = calendar.weeks.flatMap(w => w.contributionDays)

  return {
    totalContributions: calendar.totalContributions,
    totalCommits: contribData.totalCommitContributions,
    totalPRs: contribData.totalPullRequestContributions,
    totalReviews: contribData.totalPullRequestReviewContributions,
    totalIssues: contribData.totalIssueContributions,
    totalStars: 0,
    contributions: days
  }
}

async function fetchRepos(username, token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  const response = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: REPOS_QUERY, variables: { username } })
  })

  const result = await response.json()

  if (result.errors) {
    throw new Error(result.errors[0].message)
  }

  return result.data.user.repositories.nodes.map(repo => ({
    name: repo.name,
    nameWithOwner: repo.nameWithOwner,
    description: repo.description,
    url: repo.url,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    languages: repo.languages.nodes.map(l => l.name),
    updatedAt: repo.updatedAt
  }))
}

async function fetchReadme(owner, repo, token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.raw+json'
  }

  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
    headers
  })

  if (!response.ok) {
    return null
  }

  return response.text()
}

function calculateStreaks(contributions) {
  let currentStreak = 0
  let longestStreak = 0
  let streak = 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = contributions.length - 1; i >= 0; i--) {
    const day = contributions[i]
    if (day.contributionCount > 0) {
      streak++
      currentStreak = streak
    } else {
      if (streak > longestStreak) {
        longestStreak = streak
      }
      streak = 0
      const dayDate = new Date(day.date)
      dayDate.setHours(0, 0, 0, 0)
      if (dayDate < today) {
        currentStreak = 0
      }
    }
  }

  if (streak > longestStreak) {
    longestStreak = streak
  }

  return { currentStreak, longestStreak }
}

export function GitHubProvider({ children, username, token }) {
  const [data, setData] = useState(null)
  const [repos, setRepos] = useState([])
  const [repoLoading, setRepoLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username || !token) {
      setError('Missing GitHub username or token')
      setLoading(false)
      return
    }

    async function load() {
      try {
        setLoading(true)
        const result = await fetchGitHub(username, token)
        const streaks = calculateStreaks(result.contributions)
        setData({ ...result, ...streaks })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [username, token])

  const loadRepos = async () => {
    setRepoLoading(true)
    try {
      const reposData = await fetchRepos(username, token)
      setRepos(reposData)
    } catch (err) {
      console.error('Failed to load repos:', err)
    } finally {
      setRepoLoading(false)
    }
  }

  const getReadme = async (owner, repo) => {
    return fetchReadme(owner, repo, token)
  }

  return (
    <GitHubContext.Provider value={{ data, repos, repoLoading, loading, error, loadRepos, getReadme }}>
      {children}
    </GitHubContext.Provider>
  )
}

export function useGitHub() {
  const context = useContext(GitHubContext)
  if (!context) {
    throw new Error('useGitHub must be used within GitHubProvider')
  }
  return context
}