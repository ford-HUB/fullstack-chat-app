import express from 'express'
import { fireMessage, getMessages } from '../controllers/chat.controller.js'
import { authVerifyer } from '../middleware/auth.middlware.js'

const messageRoute = express.Router()

messageRoute.post('/sendMessage', authVerifyer, fireMessage)
messageRoute.get('/messages', authVerifyer, getMessages)

export default messageRoute