import mongoose from 'mongoose'

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('mongodb successfully connected')
    } catch (error) {
        console.log('mongodb failed to connect:', error.message)
    }
}