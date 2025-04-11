import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    media: { type: String, default: '' },
    isSystem: { type: Boolean, default: false }
}, { timestamps: true })

export const Message = mongoose.model('Message', MessageSchema)