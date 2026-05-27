import { Router } from 'express';
import { login, getMe } from '../controllers/adminAuthController';
import { requireAdmin } from '../middlewares/adminAuth';

const router = Router();

router.post('/login', login);
router.get('/me', requireAdmin, getMe);

export default router;
