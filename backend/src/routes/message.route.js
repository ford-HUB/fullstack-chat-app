import express from 'express'
import { fireMessage, getMessages } from '../controllers/chat.controller.js'
import { authVerifyer } from '../middleware/auth.middlware.js'
import { upload } from '../config/chatMulter.js'

const messageRoute = express.Router()

messageRoute.post('/sendMessage', upload.single('file'), authVerifyer, fireMessage)
messageRoute.get('/messages', authVerifyer, getMessages)

export default messageRoute