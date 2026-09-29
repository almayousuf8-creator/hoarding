const { Router } = require('express');
const { createLead, getLeads, markLeadAsRead, deleteLead } = require('../controllers/leads');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/', createLead);
router.get('/', authenticate, getLeads);
router.patch('/:id/read', authenticate, markLeadAsRead);
router.delete('/:id', authenticate, deleteLead);

module.exports = router;
