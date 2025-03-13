import sharp from 'sharp';

// Image Optimization Middleware
const optimizeImage = async (req, res, next) => {
  if (!(req.file || req.files?.length > 0)) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Function to optimize individual image
    const optimizeSingleImage = async (file) => {
      const compressedBuffer = await sharp(file.buffer)
        .resize(800, 600, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .webp({ effort: 6, quality: 75 }) // Optimal compression settings
        .toBuffer();

      // Update file details
      file.buffer = compressedBuffer;
      file.mimetype = 'image/webp';
      file.size = compressedBuffer.length;
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

export default optimizeImage;
