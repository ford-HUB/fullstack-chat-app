import multer from 'multer'
import cloudinary from './cloudinary.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

// Chat message storage configuration
const messageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        return {
            folder: 'chat_media',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
            resource_type: 'auto',
            transformation: { width: 1000, crop: 'limit' },
            public_id: `msg-${Date.now()}-${Math.round(Math.random() * 1E9)}`
        };
    }
});

// Single export with proper configuration
export const upload = multer({
    storage: messageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (/^image\/|application\/pdf$/.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs allowed!'), false);
        }
    }
});