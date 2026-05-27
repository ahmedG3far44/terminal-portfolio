import { Router } from 'express';
import { getContributions, getRepos, getReadme } from '../controllers/githubController';
import { requireAuth, AuthRequest } from '../middlewares/auth';
import { Request, Response, NextFunction } from 'express';

const router = Router();

function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return requireAuth(req, _res, next);
  }
  next();
}

router.get('/contributions', optionalAuth, getContributions);
router.get('/repos', requireAuth, getRepos);
router.get('/readme/:owner/:repo', optionalAuth, getReadme);

export default router;
