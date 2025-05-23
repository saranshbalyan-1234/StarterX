import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Image Optimization Middleware
export const optimizeImage = async (req, res, next) => {
  /*
   * if (!(req.file || req.files?.length > 0)) {
   *   return res.status(400).send(errorConstants.NO_FILES_UPLOADED);
   * }
   */

  try {
    // Function to optimize individual image and replace the original file
    const optimizeSingleImage = async (file) => {
      if (!file.mimetype.includes('image')) return;
      const inputPath = file.path; // Original file path
      const { dir, name } = path.parse(inputPath);

      // Add "-optimized" before the extension
      const outputPath = path.join(dir, `${name}-optimized.webp`);// New file with .webp extension

      // Compress image and write to outputPath
      await sharp(inputPath)
        .resize({
          fit: sharp.fit.inside,
          height: 800,
          width: 600,
          withoutEnlargement: true
        })
        .webp({ effort: 6, quality: 75 }) // Optimal compression settings
        .toFile(outputPath);

      // Delete the original file and replace it with the optimized one
      fs.unlinkSync(inputPath);
      console.debug(inputPath, outputPath);
      // fs.renameSync(outputPath, inputPath); //rename file to original name

      //  Update file details for further processing
      file.path = outputPath;
      file.mimetype = 'image/webp';
      file.size = fs.statSync(outputPath).size;
      file.originalname = file.originalname.replace(/\.\w+$/, '.webp');
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
  }
};
