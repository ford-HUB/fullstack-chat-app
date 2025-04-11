import jwt from 'jsonwebtoken'

export const generateToken = (payload, res) => {
    const jwtToken = jwt.sign({ userId: payload }, process.env.SECRET_KEY, { expiresIn: '7d' })

    res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'developement',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'Strict'
    })

    return jwtToken
}