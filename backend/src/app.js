import express from 'express'
import { setupSocket } from './config/socket.js'
import http from 'http'
import cors from 'cors'
import path from 'path'

const app = express()
const server = http.createServer(app)
const __dirname = path.resolve()

// @Routes Imported
import authRoutes from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import cookieParser from 'cookie-parser'

app.use(cors({
    origin: process.env.FRONT_END_BASE_URL,
    credentials: true
}))

setupSocket(server)

// @Middleware
app.use(express.json()) //parsing the request to json
app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/chat', messageRoute)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}


export { server }