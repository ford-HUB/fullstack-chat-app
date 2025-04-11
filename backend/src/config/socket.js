import { Server } from 'socket.io'

let io
const userSocketMap = {}
function setupSocket(server) {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:5173'],
        }
    })


    io.on('connection', (socket) => {
        console.log('a user connected:', socket.id)

        const userId = socket.handshake.query.userId

        if (userId) userSocketMap[userId] = socket.id

        io.emit('fireOnlineUsers', Object.keys(userSocketMap))

        socket.on('disconnect', () => {
            console.log('a user disconnected:', socket.id)
            delete userSocketMap[userId]
            io.emit('fireOnlineUsers', Object.keys(userSocketMap))
        })
    })
}

const getRecieverSocketId = (userId) => { // this helper can we used to get the userId of our
    return userSocketMap[userId]
}

export { setupSocket, getRecieverSocketId, io }
