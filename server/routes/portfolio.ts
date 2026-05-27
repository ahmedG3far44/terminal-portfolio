import { Router } from 'express';
import { getPortfolio, getPortfolioByUsername, getProjectById, getProjectByUsernameAndId, updatePortfolio, resetPortfolio } from '../controllers/portfolioController';
import { requireAuth, AuthRequest } from '../middlewares/auth';
import { Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return requireAuth(authReq, res, next);
  }
  next();
}, getPortfolio);

router.get('/project/:projectId', (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthRequest;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return requireAuth(authReq, res, next);
  }
  next();
}, getProjectById);

router.get('/:username', getPortfolioByUsername);
router.get('/:username/project/:projectId', getProjectByUsernameAndId);

router.put('/', requireAuth, updatePortfolio);
router.post('/reset', requireAuth, resetPortfolio);

export default router;
