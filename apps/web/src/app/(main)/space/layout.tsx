import { SocketProvider } from "@/shared/context/socket";
import React from "react";

interface VideoCallLayoutProps {
  children: React.ReactNode; 
}

const VideoCallLayout: React.FC<VideoCallLayoutProps> = ({ children }) => {
  return (
    <SocketProvider>
      <div>
        {children}
      </div>
    </SocketProvider>
  );
};

export default VideoCallLayout;