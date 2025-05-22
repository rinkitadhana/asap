import { Server } from "socket.io"
import { createServer } from "http"
import type { IncomingMessage, ServerResponse } from "http"

const PORT = process.env.PORT || 3001

const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200)
  res.end("webSocket Server is Running!")
})

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
})

io.on("connection", (socket) => {
  console.log("Server is connected to socket!", socket.id)
  socket.on("disconnect", () => {
    console.log("Server is disconnected from socket!", socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
