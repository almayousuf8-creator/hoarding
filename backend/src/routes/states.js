const { Router } = require('express');
const { getAll, getById, create, update, updateStatus, remove } = require('../controllers/states');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.patch('/:id/status', authenticate, updateStatus);

module.exports = router;
