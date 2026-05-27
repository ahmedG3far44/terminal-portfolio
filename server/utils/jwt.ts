import jwt from 'jsonwebtoken';
import { env } from '../configs/env';

interface UserPayload {
  userId: string;
  githubUsername: string;
  role: 'user';
  hasToken: boolean;
}

interface AdminPayload {
  adminId: string;
  email: string;
  role: 'super_admin';
}

export function signUserJwt(payload: UserPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyUserJwt(token: string): UserPayload {
  return jwt.verify(token, env.JWT_SECRET) as UserPayload;
}

export function signAdminJwt(payload: AdminPayload): string {
  return jwt.sign(payload, env.JWT_ADMIN_SECRET, { expiresIn: '24h' });
}

export function verifyAdminJwt(token: string): AdminPayload {
  return jwt.verify(token, env.JWT_ADMIN_SECRET) as AdminPayload;
}
