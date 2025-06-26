import express, { type Request, type Response } from "express"
import { Server } from "socket.io"
import {createServer} from "http"

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello China!")
})

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id)

  socket.on("join-room", (roomId, userId) => {
    console.log(`User ${userId} joined room ${roomId}`)
    socket.join(roomId)
    socket.broadcast.to(roomId).emit("user-connected", userId)
  })

  socket.on("user-toggle-audio", (userId, roomId) => {
    console.log(`User ${userId} toggled audio in room ${roomId}`);
    socket.broadcast.to(roomId).emit("user-toggle-audio", userId);
  });

  socket.on("user-toggle-video", (userId, roomId) => {
    console.log(`User ${userId} toggled video in room ${roomId}`);
    socket.broadcast.to(roomId).emit("user-toggle-video", userId);
  });

  socket.on("user-leave", (userId, roomId) => {
    console.log(`User ${userId} left room ${roomId}`);
    socket.broadcast.to(roomId).emit("user-leave", userId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
})

httpServer.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);})