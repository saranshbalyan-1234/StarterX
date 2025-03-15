// import sharp from 'sharp';

import errorConstants from '#constants/error.constant.js';

// Image Optimization Middleware
export const optimizeImage = async (req, res, next) => {
  if (!(req.file || req.files?.length > 0)) {
    return res.status(400).send(errorConstants.NO_FILES_UPLOADED);
  }

  try {
    // Function to optimize individual image
    const optimizeSingleImage = (file) => {
      /*
       * const compressedBuffer = await sharp(file.buffer)
       *   .resize(800, 600, {
       *     fit: sharp.fit.inside,
       *     withoutEnlargement: true
       *   })
       *   .webp({ effort: 6, quality: 75 }) // Optimal compression settings
       *   .toBuffer();
       */

      /*
       * Update file details
       * file.buffer = compressedBuffer;
       */
      file.mimetype = 'image/webp';
      // file.size = compressedBuffer.length;
      file.originalname = file.originalname.replace(/\.\w+$/, '.webp'); // Change file extension to .webp
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

export const collectFilesBeforeMulter = (req, _res, next) => {
  // Initialize `req.files`

  // Collect files from different field keys into `req.files`
  if (req.body) {
    const files = [];
    for (const field in req.body) {
      if (Array.isArray(req.body[field])) {
        files.push(...req.body[field]); // For multiple files in one key
      } else {
        files.push(req.body[field]); // For single file
      }
    }
    req.files = files;
  }
  next();
};
