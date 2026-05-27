import { env } from '../configs/env';

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';
const GITHUB_API = 'https://api.github.com';

function headers(accessToken?: string) {
  const token = accessToken || env.GITHUB_TOKEN;
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

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
`;

const REPOS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      repositories(first: 100, ownerAffiliations: [OWNER], orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          name
          nameWithOwner
          description
          url
          stargazerCount
          forkCount
          languages(first: 5) {
            nodes { name }
          }
          defaultBranchRef {
            target { commitUrl }
          }
          updatedAt
        }
      }
    }
  }
`;

function calculateStreaks(contributions: { date: string; count: number }[]) {
  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = contributions.length - 1; i >= 0; i--) {
    const day = contributions[i];
    if (day.count > 0) {
      streak++;
      currentStreak = streak;
    } else {
      if (streak > longestStreak) longestStreak = streak;
      streak = 0;
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);
      if (dayDate < today) currentStreak = 0;
    }
  }
  if (streak > longestStreak) longestStreak = streak;
  return { currentStreak, longestStreak };
}

export async function fetchContributions(username: string, accessToken?: string) {
  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: headers(accessToken),
    body: JSON.stringify({ query: CONTRIBUTION_QUERY, variables: { username } }),
  });

  const result: any = await res.json();
  if (result.errors) throw new Error(result.errors[0].message);

  const contribData = result.data.user.contributionsCollection;
  const calendar = contribData.contributionCalendar;
  const days = calendar.weeks.flatMap((w: any) => w.contributionDays).map((d: any) => ({
    date: d.date,
    count: d.contributionCount,
    color: d.color,
  }));
  const streaks = calculateStreaks(days);

  return {
    totalContributions: calendar.totalContributions,
    totalCommits: contribData.totalCommitContributions,
    totalPRs: contribData.totalPullRequestContributions,
    totalReviews: contribData.totalPullRequestReviewContributions,
    totalIssues: contribData.totalIssueContributions,
    contributions: days,
    ...streaks,
  };
}

export async function fetchRepos(username: string, accessToken?: string) {
  const res = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: headers(accessToken),
    body: JSON.stringify({ query: REPOS_QUERY, variables: { username } }),
  });

  const result: any = await res.json();
  if (result.errors) throw new Error(result.errors[0].message);

  return result.data.user.repositories.nodes.map((repo: any) => ({
    name: repo.name,
    nameWithOwner: repo.nameWithOwner,
    description: repo.description,
    url: repo.url,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    languages: repo.languages.nodes.map((l: any) => l.name),
    updatedAt: repo.updatedAt,
  }));
}

export async function fetchReadme(owner: string, repo: string, accessToken?: string) {
  try {
    const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, {
      headers: {
        ...headers(accessToken),
        Accept: 'application/vnd.github.raw+json',
      },
    });
    if (!res.ok) return null;
    return res.text();
  } catch {
    return null;
  }
}
