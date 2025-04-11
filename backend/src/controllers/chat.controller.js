import { Message } from '../models/Message.model.js'
import { io } from '../config/socket.js'

import { User } from '../models/User.models.js'

export const fireMessage = async (req, res) => {
    try {
        const { receivedMessage } = req.body

        const userId = req.user._id

        if (!receivedMessage) { return res.json({ success: false, message: 'you cannot send an empty message ' }) }

        const isUserValid = await User.findById(userId)
        if (!isUserValid) { return res.json({ success: false, message: 'user id not found' }) }

        const newMessage = new Message({
            sender: isUserValid._id,
            message: receivedMessage,
            isSystem: false,
            media: ''
        })

        if (newMessage) {
            await newMessage.save()
            const populateMessage = await newMessage.populate('sender', 'avatar username')
            io.emit('chatMessage', populateMessage)
            res.json({ success: true, message: 'send message', data: populateMessage })
            console.log('successfully saved', populateMessage)
        }

    } catch (error) {
        console.log('fire message fails', error.message)
        res.json({ success: false, error: 'Internal Server Error' })
    }
}

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('sender', 'avatar username')

        if (!messages) { res.json({ success: false, message: 'messages is currently no history' }) }

        const sortMessage = messages.reverse()

        res.json({ success: true, data: sortMessage })
    } catch (error) {
        console.log('getMessages fails', error.message)
        res.json({ success: false, message: 'Internal Server Error' })
    }
}