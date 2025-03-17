import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Multer Storage (Saves in /uploads folder)
const uploadDir = './uploads';

// Function to create Multer storage configuration
const createStorage = ({
  fileSize = 5 * 1024 * 1024,
  folder = ''
} = {}
) => {
  const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
      const subDir = folder || req.params.folder; // Folder picked from req.params
      const fullPath = path.join(uploadDir, subDir, req.currentTenant);

      if (!fs.existsSync(fullPath)) {
        console.error(`Subdirectory "${fullPath}" does not exist. Creating it now...`);
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext).replace(/\s/g, '');
      cb(null, `${name}-${Date.now()}${ext}`);
    }
  });
  return multer({
    limits: { fileSize },
    storage
  });
};

export default createStorage;

/*
 * File Filter (For limiting file types)
 * const fileFilter = (_req, file, cb) => {
 *   const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
 *   if (allowedTypes.includes(file.mimetype)) {
 *     cb(null, true);
 *   } else {
 *     cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed!'), false);
 *   }
 * };
 */
