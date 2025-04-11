import express from 'express'
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js'
import { authVerifyer } from '../middleware/auth.middlware.js'
import { upload } from '../config/multer.js'

// @Controller Imported

const authRoutes = express.Router()

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)
authRoutes.get('/checkAuth', authVerifyer, checkAuth)

authRoutes.put('/updateProfile', upload.single('avatar'), authVerifyer, updateProfile)

export default authRoutes