import { Request, Response } from 'express';
import { env } from '../configs/env';
import { User } from '../models/User';
import { Portfolio } from '../models/Portfolio';
import { signUserJwt } from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth';

export function redirectToGitHub(_req: Request, res: Response) {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${env.CLIENT_URL}/api/auth/github/callback`,
    scope: 'read:user repo',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}

export async function githubCallback(req: Request, res: Response) {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    return res.redirect(`${env.CLIENT_URL}/login?error=missing_code`);
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData: any = await tokenRes.json();
    if (tokenData.error) {
      return res.redirect(`${env.CLIENT_URL}/login?error=${tokenData.error}`);
    }

    const accessToken = tokenData.access_token as string;

    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const githubUser: any = await userRes.json();

    let user = await User.findOne({ githubId: githubUser.id.toString() });
    if (user) {
      user.lastLoginAt = new Date();
      user.githubAccessToken = accessToken;
      await user.save();
    } else {
      user = await User.create({
        githubId: githubUser.id.toString(),
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url || '',
        profileUrl: githubUser.html_url || '',
        email: githubUser.email || null,
        githubAccessToken: accessToken,
        lastLoginAt: new Date(),
      });

      await Portfolio.create({
        userId: user._id,
        personalInfo: {
          name: githubUser.name || githubUser.login,
          title: '',
          bio: '',
          availableForHire: false,
          email: githubUser.email || '',
          linkedin: '',
          github: githubUser.html_url || '',
        },
        skills: [],
        projects: [],
      });
    }

    const token = signUserJwt({
      userId: user._id.toString(),
      githubUsername: user.username,
      role: 'user',
      hasToken: true,
    });

    res.redirect(`${env.CLIENT_URL}/dashboard?token=${token}`);
  } catch (err: any) {
    console.error('GitHub OAuth error:', err);
    res.redirect(`${env.CLIENT_URL}/admin?error=auth_failed`);
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await User.findById(req.user?.userId).select('-__v -githubAccessToken');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, error: 'Account is blocked' });
    }
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        hasToken: !!(await User.findById(user._id)?.select('githubAccessToken'))?.githubAccessToken,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
