import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import {
  addContact,
  updateContact,
  deleteContact,
  migrateSocialFields,
  getContacts,
} from '../controllers/contactController';

const router = Router();

router.get('/', requireAuth, getContacts);
router.post('/', requireAuth, addContact);
router.post('/migrate', requireAuth, migrateSocialFields);
router.put('/:contactId', requireAuth, updateContact);
router.delete('/:contactId', requireAuth, deleteContact);

export default router;
