const { Router } = require('express');
const { getAll, create, markRead, remove } = require('../controllers/leads');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, getAll);
router.post('/', create);
router.patch('/:id/read', authenticate, markRead);
router.delete('/:id', authenticate, remove);

module.exports = router;
