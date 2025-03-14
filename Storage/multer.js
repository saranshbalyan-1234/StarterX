import multer from 'multer';
import path from 'path';

// Set up Multer Storage (Saves in /uploads folder)
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

// File Filter function
const fileFilter = (req, file, cb) => {
    // Accept images only (png, jpg, jpeg, gif)
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: File upload only supports the following filetypes - ' + filetypes);
    }
};

// Limits for the upload
const limits = {
    fileSize: 1 * 1024 * 1024 // 1 MB (change as needed)
};

// Set up the upload middleware
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

export default upload;
