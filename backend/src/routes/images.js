const { Router } = require('express');
const { uploadImages, getImages, deleteImage } = require('../controllers/images');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const router = Router();

router.post('/:hoardingId', authenticate, upload.any(), uploadImages);
router.get('/:hoardingId', getImages);
router.delete('/:imageId', authenticate, deleteImage);

module.exports = router;
