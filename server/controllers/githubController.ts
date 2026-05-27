import { Response } from 'express';
import { fetchContributions, fetchRepos, fetchReadme } from '../utils/github';
import { env } from '../configs/env';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';

async function getUserToken(req: AuthRequest): Promise<string | null> {
  if (!req.user) return null;
  const user = await User.findById(req.user.userId).select('githubAccessToken');
  return user?.githubAccessToken || null;
}

export async function getContributions(req: AuthRequest, res: Response) {
  try {
    const accessToken = await getUserToken(req);
    const username = req.user?.githubUsername || env.GITHUB_USERNAME;
    const data = await fetchContributions(username, accessToken || undefined);
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
    const accessToken = await getUserToken(req);
    if (!accessToken) {
      return res.status(401).json({ success: false, error: 'GitHub token not found. Please login again.', needsReauth: true });
    }
    const username = req.user?.githubUsername || env.GITHUB_USERNAME;
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
    const accessToken = await getUserToken(req);
    const content = await fetchReadme(owner, repo, accessToken || undefined);
    if (content === null) {
      return res.status(404).json({ success: false, error: 'README not found' });
    }
    res.json({ success: true, data: content });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
