import fs from 'fs';
import multer from 'multer';
import path from 'path';
// Multer Storage (Saves in /uploads folder)

const uploadDir = "./uploads";
const subDirs = ["public", "private"];

if (!fs.existsSync(uploadDir)) {
  console.error(
    `Base uploads directory does not exist. Creating "${uploadDir}" now...`
  );
  fs.mkdirSync(uploadDir);
}

subDirs.forEach((subDir) => {
  const fullPath = path.join(uploadDir, subDir);
  if (!fs.existsSync(fullPath)) {
    console.error(
      `Subdirectory "${fullPath}" does not exist. Creating it now...`
    );
    fs.mkdirSync(fullPath);
  } else {
    console.log(`Subdirectory "${fullPath}" already exists. Proceeding...`);
  }
});

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

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

const upload = multer({
  // fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  storage
});

export default upload;
