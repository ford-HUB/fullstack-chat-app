import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minLength: 6 },
    avatar: {
        public_id: { type: String, default: '' },
        url: { type: String, default: '' }
    }
}, { timestamps: true })

export const User = mongoose.model('User', UserSchema)