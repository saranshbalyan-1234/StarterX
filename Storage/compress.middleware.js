import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
// import imageminWebp from 'imagemin-webp';
import fs from 'fs';
// import path from 'path';

export const optimizeImage = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next(); // Skip if no files

    // Process each file
    const optimizedImages = await Promise.all(req.files.map(async (file) => {
        const inputPath = file.path;    // Original uploaded file
        const outputDir = `./public/`; // Output folder

        await imagemin(['images/*.{jpg,jpeg,png}'], {
            destination: outputDir,
            plugins: [
                imageminMozjpeg({ quality: 75 }),
                imageminPngquant({ quality: [0.6, 0.8] }),
                // imageminWebp({ quality: 70 })
            ]
        });

        // Remove original file after optimization
        fs.unlinkSync(inputPath);

        // Update file path reference in request
        file.path = outputDir+file.filename;
    }));

    next();
};
