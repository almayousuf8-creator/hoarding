import { Router } from 'express';
import { createLead, getLeads, markLeadAsRead, deleteLead } from '../controllers/leads';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', createLead); // Public endpoint for the contact form
router.get('/', authenticate, getLeads);
router.patch('/:id/read', authenticate, markLeadAsRead);
router.delete('/:id', authenticate, deleteLead);

export default router;
