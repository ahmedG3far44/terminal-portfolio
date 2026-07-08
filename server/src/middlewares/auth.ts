import { Request, Response, NextFunction } from 'express';
import { verifyUserJwt } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    githubUsername: string;
    githubToken: string | null;
    role: 'user';
    hasToken: boolean;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid token' });
  }

  try {
    const token = header.split(' ')[1];
    req.user = verifyUserJwt(token);
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}
