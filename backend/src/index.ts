import express, { type Request, type Response } from "express"
import { Server } from "socket.io"
import { createServer } from "http"

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
  res.send("bordre is live :D")
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

    // Get the number of users in the room
    const room = io.sockets.adapter.rooms.get(roomId);
    const usersInRoom = room ? room.size : 0;
    console.log(`Room ${roomId} now has ${usersInRoom} users`);

    // Only broadcast to other users (not including the one who just joined)
    socket.broadcast.to(roomId).emit("user-connected", userId)
    console.log(`Broadcasting user-connected event for ${userId} to ${usersInRoom - 1} other users in room ${roomId}`);
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
})

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})