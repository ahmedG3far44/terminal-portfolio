import { Router } from 'express';
import { redirectToGitHub, githubCallback, getMe } from '../controllers/authController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.get('/github', redirectToGitHub);
router.get('/github/callback', githubCallback);
router.get('/me', requireAuth, getMe);

export default router;
