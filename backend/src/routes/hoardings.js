const { Router } = require('express');
const { getAll, getById, create, update, updateStatus, remove, updateAvailability } = require('../controllers/hoardings');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, upload.any(), create);
router.put('/:id', authenticate, upload.any(), update);
router.delete('/:id', authenticate, remove);
router.patch('/:id/status', authenticate, updateStatus);
router.patch('/:id/availability', authenticate, updateAvailability);

module.exports = router;
