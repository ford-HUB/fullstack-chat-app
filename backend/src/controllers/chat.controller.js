import { Message } from '../models/Message.model.js'
import cloudinary from '../config/cloudinary.js'
import { io } from '../config/socket.js'

import { User } from '../models/User.models.js'

export const fireMessage = async (req, res) => {
    try {
        const { message } = req.body
        const media = req.file

        const userId = req.user._id

        let mediaPayload = null

        if (!message) { return res.json({ success: false, message: 'you cannot send an empty message ' }) }

        const isUserValid = await User.findById(userId)
        if (!isUserValid) { return res.json({ success: false, message: 'user id not found' }) }

        if (media && media.path) {
            try {
                const uploadedMedia = await cloudinary.uploader.upload(media.path, {
                    folder: 'chat_media',
                    resource_type: 'auto'
                });

                mediaPayload = {
                    public_id: uploadedMedia.public_id,
                    url: uploadedMedia.secure_url
                };

                console.log('Image successfully uploaded to Cloudinary');
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.json({
                    success: false,
                    error: 'Failed to upload image to Cloudinary'
                });
            }
        }


        const newMessage = new Message({
            sender: isUserValid._id,
            message: message || '',
            isSystem: false,
            media: mediaPayload
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