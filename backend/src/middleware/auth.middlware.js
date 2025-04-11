import jwt from 'jsonwebtoken'
import { User } from '../models/User.models.js'

export const authVerifyer = async (req, res, next) => {
    try {
        const jwtToken = req.cookies.token

        if (!jwtToken) { return res.json({ success: false, message: 'Not Provided --Jwt Token--' }) }

        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY)
        const decoded = await User.findById(payload.userId).select('-password')

        if (!decoded) { return res.json({ success: false, message: 'payload id not found' }) }

        req.user = decoded
        next()
    } catch (error) {
        console.log('middleware fails: ', error.message)
        res.json({ success: false, error: error.message })
    }

}