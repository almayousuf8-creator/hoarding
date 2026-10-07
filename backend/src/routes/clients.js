const { Router } = require('express');
const { getAll, getById, create, update, updateStatus, remove, confirmBooking } = require('../controllers/clients');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.patch('/:id/status', authenticate, updateStatus);
router.post('/:id/confirm-booking', authenticate, requireAdmin, confirmBooking);

module.exports = router;