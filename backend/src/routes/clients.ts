import { Router } from 'express';
import { getAll, getById, create, update, updateStatus, remove, confirmBooking } from '../controllers/clients';
import { authenticate, requireAdmin, requireClient } from '../middleware/auth';

const router = Router();

router.get('/', getAll); // Make public or protected based on needs
router.get('/:id', getById);
router.post('/', create); // Publicly accessible for booking inquiries
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.patch('/:id/status', authenticate, updateStatus);
router.post('/:id/confirm-booking', authenticate, requireAdmin, confirmBooking);

export default router;
