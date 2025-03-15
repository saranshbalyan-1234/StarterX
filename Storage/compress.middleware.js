import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

import errorConstants from '#constants/error.constant.js';

// Image Optimization Middleware
export const optimizeImage = async (req, res, next) => {
  if (!(req.file || req.files?.length > 0)) {
    return res.status(400).send(errorConstants.NO_FILES_UPLOADED);
  }

  try {
    // Function to optimize individual image and replace the original file
    const optimizeSingleImage = async (file) => {
      const inputPath = file.path; // Original file path
      const outputPath = inputPath.replace(/\.\w+$/, '.webp'); // New file with .webp extension

      // Compress image and write to outputPath
      await sharp(inputPath)
        .resize(800, 600, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .webp({ effort: 6, quality: 75 }) // Optimal compression settings
        .toFile(outputPath);

      // Delete the original file and replace it with the optimized one
      fs.unlinkSync(inputPath);
      fs.renameSync(outputPath, inputPath);

      // Update file details for further processing
      // file.path = inputPath;
      // file.mimetype = 'image/webp';
      // file.size = fs.statSync(inputPath).size;
      // file.originalname = file.originalname.replace(/\.\w+$/, '.webp');
    };

    // Handle multiple files
    if (req.files && req.files.length > 0) {
      await Promise.all(req.files.map(optimizeSingleImage));
    }

    // Handle single file scenario
    if (req.file) {
      await optimizeSingleImage(req.file);
    }

    next();
  } catch (err) {
    console.error('Image Optimization Error:', err);
    res.status(500).send('Error optimizing the image(s).');
  }
};

// // Collect files before Multer Middleware
// export const collectFilesBeforeMulter = (req, _res, next) => {
//   // Initialize `req.files`
//   if (req.body) {
//     const files = [];
//     for (const field in req.body) {
//       if (Array.isArray(req.body[field])) {
//         files.push(...req.body[field]); // For multiple files in one key
//       } else {
//         files.push(req.body[field]); // For single file
//       }
//     }
//     req.files = files;
//   }
//   next();
// };
