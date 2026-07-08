import { Router } from 'express';
import { getActiveThemes } from '../controllers/adminController';

const router = Router();

router.get('/', getActiveThemes);

export default router;
