const sharp = require('sharp');


// Image Optimization Middleware
const optimizeImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Compress image and replace buffer in memory
        const compressedBuffer = await sharp(req.file.buffer)
            .resize(800, 600, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .webp({ quality: 75, effort: 6 }) // Optimal compression settings
            .toBuffer();

        // Replace req.file data with the optimized buffer
        req.file.buffer = compressedBuffer;
        req.file.mimetype = 'image/webp';
        req.file.size = compressedBuffer.length;
        req.file.originalname = req.file.originalname.replace(/\.\w+$/, '.webp'); // Change file extension to .webp

        next();
    } catch (err) {
        console.error('Image Optimization Error:', err);
        res.status(500).send('Error optimizing the image.');
    }
};

export default optimizeImage