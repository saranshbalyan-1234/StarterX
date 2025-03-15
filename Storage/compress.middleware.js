import fs from 'fs';
import sharp from 'sharp';

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

      /*
       * Update file details for further processing
       * file.path = inputPath;
       * file.mimetype = 'image/webp';
       * file.size = fs.statSync(inputPath).size;
       * file.originalname = file.originalname.replace(/\.\w+$/, '.webp');
       */
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
