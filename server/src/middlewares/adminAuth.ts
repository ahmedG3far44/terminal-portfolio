import { Request, Response, NextFunction } from 'express';
import { verifyAdminJwt } from '../utils/jwt';

export interface AdminAuthRequest extends Request {
  admin?: {
    adminId: string;
    email: string;
    role: 'super_admin';
  };
}

export function requireAdmin(req: AdminAuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid token' });
  }

  try {
    const token = header.split(' ')[1];
    req.admin = verifyAdminJwt(token);
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}
