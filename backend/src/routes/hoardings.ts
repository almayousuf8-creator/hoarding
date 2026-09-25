import { Router } from 'express';
import { getAll, getById, create, update, updateStatus, remove } from '../controllers/hoardings';
import { authenticate, requireAdmin, requireClient } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getAll); // Make public or protected based on needs
router.get('/:id', getById);
router.post('/', authenticate, upload.single('image'), create); // Refine roles later
router.put('/:id', authenticate, upload.single('image'), update);
router.delete('/:id', authenticate, remove);
router.patch('/:id/status', authenticate, updateStatus);

export default router;
