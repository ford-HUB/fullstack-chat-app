// import { server } from "./config/socket.js"
import { server } from "./app.js"
import { config } from "dotenv"
import { dbConnection } from "./config/db.js"
config()
dbConnection()

server.listen(process.env.PORT, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`)
})
