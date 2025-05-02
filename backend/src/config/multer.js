import multer from 'multer'
import cloudinary from './cloudinary.js'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'UserProfile',
        allowed_formats: ['png', 'jpg', 'jpeg'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
})

export const upload = multer({ storage: storage })





