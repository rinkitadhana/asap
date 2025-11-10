import type { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export function initSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected SocketId: ", socket.id);

    socket.on("join-room", (roomId, userId) => {
      console.log(`User UserId: ${userId} joined room RoomId: ${roomId} SocketId: ${socket.id}`);
      socket.join(roomId);

      const room = io.sockets.adapter.rooms.get(roomId);
      const usersInRoom = room ? room.size : 0;
      console.log(`Room RoomId: ${roomId} now has ${usersInRoom} users`);

      socket.broadcast.to(roomId).emit("user-connected", userId);
      console.log(
        `Broadcasting user-connected event for UserId: ${userId} to ${usersInRoom - 1} other users in room ${roomId}`,
      );
    });

    socket.on("user-toggle-audio", (userId, roomId) => {
      console.log(`User UserId: ${userId} toggled audio in room RoomId: ${roomId}`);
      socket.broadcast.to(roomId).emit("user-toggle-audio", userId);
    });

    socket.on("user-toggle-video", (userId, roomId) => {
      console.log(`User UserId: ${userId} toggled video in room RoomId: ${roomId}`);
      socket.broadcast.to(roomId).emit("user-toggle-video", userId);
    });

    socket.on("user-toggle-speaker", (userId, roomId) => {
      console.log(`User UserId: ${userId} toggled speaker in room RoomId: ${roomId}`);
      socket.broadcast.to(roomId).emit("user-toggle-speaker", userId);
    });

    socket.on("user-leave", (userId, roomId) => {
      console.log(`User UserId: ${userId} left room RoomId: ${roomId}`);
      socket.broadcast.to(roomId).emit("user-leave", userId);
    });
  });

  return io;
}
