import { Router } from 'express';
import { requireAdmin } from '../middlewares/adminAuth';
import {
  getInsights,
  getUsers,
  blockUser,
  activateUser,
  getThemes,
  createTheme,
  updateTheme,
  deleteTheme,
  getActiveThemes,
} from '../controllers/adminController';

const router = Router();

router.get('/insights', requireAdmin, getInsights);
router.get('/users', requireAdmin, getUsers);
router.patch('/users/:id/block', requireAdmin, blockUser);
router.patch('/users/:id/activate', requireAdmin, activateUser);
router.get('/themes', requireAdmin, getThemes);
router.post('/themes', requireAdmin, createTheme);
router.put('/themes/:id', requireAdmin, updateTheme);
router.delete('/themes/:id', requireAdmin, deleteTheme);

export default router;
