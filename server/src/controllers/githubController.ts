import { Response } from 'express';
import { fetchContributions, fetchRepos, fetchReadme } from '../utils/github';
import { AuthRequest } from '../middlewares/auth';
import { get as cacheGet, set as cacheSet } from '../utils/cache';

const CACHE_TTL = 10 * 60 * 1000;

export async function getContributions(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.githubUsername || !req.user?.githubToken) {
      return res.status(401).json({ success: false, error: 'Authentication required. Please login with GitHub.', needsReauth: true });
    }
    const { githubUsername: username, githubToken: accessToken } = req.user;
    const cacheKey = `github:contributions:${username}`;

    const cached = cacheGet<object>(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }

    const data = await fetchContributions(username, accessToken);
    cacheSet(cacheKey, data, CACHE_TTL);
    res.json({ success: true, data });
  } catch (err: any) {
    if (err.message?.includes('Bad credentials') || err.message?.includes('401')) {
      return res.status(401).json({ success: false, error: 'GitHub token expired. Please login again.', needsReauth: true });
    }
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getRepos(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.githubToken) {
      return res.status(401).json({ success: false, error: 'GitHub token not found. Please login again.', needsReauth: true });
    }
    const { githubUsername: username, githubToken: accessToken } = req.user;
    const data = await fetchRepos(username, accessToken);
    res.json({ success: true, data });
  } catch (err: any) {
    if (err.message?.includes('Bad credentials') || err.message?.includes('401')) {
      return res.status(401).json({ success: false, error: 'GitHub token expired. Please login again.', needsReauth: true });
    }
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getReadme(req: AuthRequest, res: Response) {
  const { owner, repo } = req.params;
  if (!owner || !repo) {
    return res.status(400).json({ success: false, error: 'Owner and repo are required' });
  }

  try {
    if (!req.user?.githubToken) {
      return res.status(401).json({ success: false, error: 'Authentication required. Please login with GitHub.', needsReauth: true });
    }
    const content = await fetchReadme(owner, repo, req.user.githubToken);
    if (content === null) {
      return res.status(404).json({ success: false, error: 'README not found' });
    }
    res.json({ success: true, data: content });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
