import { Router } from 'express';
import { getAll, getById, create, update, updateStatus, remove } from '../controllers/states';
import { authenticate, requireAdmin, requireClient } from '../middleware/auth';

const router = Router();

router.get('/', getAll); // Make public or protected based on needs
router.get('/:id', getById);
router.post('/', authenticate, create); // Refine roles later
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.patch('/:id/status', authenticate, updateStatus);

export default router;
