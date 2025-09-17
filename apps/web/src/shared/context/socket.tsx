'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// Define the events that our socket will handle
interface ServerToClientEvents {
  "user-connected": (userId: string) => void;
  "user-toggle-audio": (userId: string) => void;
  "user-toggle-video": (userId: string) => void;
  "user-toggle-speaker": (userId: string) => void;
  "user-leave": (userId: string) => void;
}

interface ClientToServerEvents {
  "join-room": (roomId: string, userId: string) => void;
  "user-toggle-audio": (userId: string, roomId: string) => void;
  "user-toggle-video": (userId: string, roomId: string) => void;
  "user-toggle-speaker": (userId: string, roomId: string) => void;
  "user-leave": (userId: string, roomId: string) => void;
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
type SocketContextType = SocketType | null;

const SocketContext = createContext<SocketContextType>(null);

export const useSocket = (): SocketContextType => {
  const socket = useContext(SocketContext);
  return socket;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<SocketContextType>(null);

  useEffect(() => {
    // Connect to the backend socket server
    const connection: SocketType = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    console.log("Attempting to establish socket connection...");

    connection.on("connect", () => {
      console.log("Socket connection established:", connection.id);
      setSocket(connection);
    });

    connection.on("connect_error", (err) => {
      console.error("Error establishing socket connection:", err);
    });

    connection.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setSocket(null);
    });

    // Clean up on unmount
    return () => {
      connection.disconnect();
      console.log("Socket connection closed");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// Helper hook for common video calling operations
export const useVideoCall = () => {
  const socket = useSocket();

  const joinRoom = (roomId: string, userId: string) => {
    if (socket) {
      console.log(`Joining room ${roomId} as user ${userId}`);
      socket.emit("join-room", roomId, userId);
    }
  };

  const toggleAudio = (userId: string, roomId: string) => {
    if (socket) {
      console.log(`Toggling audio for user ${userId} in room ${roomId}`);
      socket.emit("user-toggle-audio", userId, roomId);
    }
  };

  const toggleVideo = (userId: string, roomId: string) => {
    if (socket) {
      console.log(`Toggling video for user ${userId} in room ${roomId}`);
      socket.emit("user-toggle-video", userId, roomId);
    }
  };

  const leaveRoom = (userId: string, roomId: string) => {
    if (socket) {
      console.log(`User ${userId} leaving room ${roomId}`);
      socket.emit("user-leave", userId, roomId);
    }
  };

  return {
    socket,
    joinRoom,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
};