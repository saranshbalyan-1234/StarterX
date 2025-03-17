import fs from 'fs';
import multer from 'multer';
import path from 'path';
// Multer Storage (Saves in /uploads folder)

const uploadDir = './uploads';
const subDirs = ['public', 'private'];

if (fs.existsSync(uploadDir)) {
  console.log(`"${uploadDir}" already exists. Proceeding...`);
} else {
  console.error(
      `Base uploads directory does not exist. Creating "${uploadDir}" now...`
  );
  fs.mkdirSync(uploadDir);
}

subDirs.forEach((subDir) => {
  const fullPath = path.join(uploadDir, subDir);
  if (fs.existsSync(fullPath)) {
    console.log(`Subdirectory "${fullPath}" already exists. Proceeding...`);
  } else {
    console.error(
        `Subdirectory "${fullPath}" does not exist. Creating it now...`
    );
    fs.mkdirSync(fullPath);
  }
});

// Function to create Multer storage configuration
 const createStorage = (subDir, fileSize = 5 * 1024 * 1024) => {
 const storage = multer.diskStorage({
    destination: path.join(uploadDir, subDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${Date.now()}${ext}`);
    }
  });
  return multer({
    limits: { fileSize },
    storage: storage
  });
 }

export default createStorage;

// Create Multer instances for each subdirectory
// export const uploadPublic = 

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
