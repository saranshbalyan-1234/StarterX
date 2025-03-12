import multer from 'multer';
import path from 'path';

// Multer Storage (Saves in /uploads folder)
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}.${ext}`);
    }
});

const upload = multer({ storage: storage });

export default upload
