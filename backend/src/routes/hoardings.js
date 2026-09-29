const { Router } = require('express');
const { getAll, getById, create, update, updateStatus, remove } = require('../controllers/hoardings');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, upload.single('image'), create);
router.put('/:id', authenticate, upload.single('image'), update);
router.delete('/:id', authenticate, remove);
router.patch('/:id/status', authenticate, updateStatus);

module.exports = router;
