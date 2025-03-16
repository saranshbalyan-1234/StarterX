import multer from 'multer';
import path from 'path';

// Multer Storage (Saves in /uploads folder)
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

// File Filter (For limiting file types)
const fileFilter = (_req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed!'), false);
  }
};

const upload = multer({
  // Limit file size to 5MB
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
  storage
});

export default upload;
