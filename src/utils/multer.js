const path = require('path');
const multer = require('multer');

const MULTER_UPLOAD_FOLDER = path.join(__dirname, '../uploads/');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, MULTER_UPLOAD_FOLDER);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new AppError(400, 'Invalid file type'));
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;
