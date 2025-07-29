"use client"
import React, { useEffect } from "react"
import { useSocket } from "@/context/socket"
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "./Player";

const Screen = () => {
  const socket = useSocket();
  const {peer, myId} = usePeer();
  const {stream} = useMediaStream();

  useEffect(()=>{
    if (!socket || !peer || !stream) {
      console.log("Socket, peer or stream not available yet");
      return;
    }
    const handleUserConnected = (newUserId: string) =>{
      console.log(`User connected in a room with userID: ${newUserId}`)
      const call = peer.call(newUserId, stream);

      call.on('stream', (incomingStream: MediaStream)=>{
        console.log(`Received stream from user ${newUserId}`);
      })
    }
    socket.on("user-connected", handleUserConnected);
    
    return () =>{
      console.log("Cleaning up user-connected listener");
      socket.off("user-connected", handleUserConnected);
    }
  }, [socket, peer, stream])

  useEffect(()=>{
    if (!peer || !stream) return;
    peer.on("call", (call)=>{
      const {peer: callerId} =call;
      call.answer(stream);

      call.on('stream', (incomingStream: MediaStream)=>{
        console.log(`Received stream from user ${callerId}`);
      })
    })
  }, [peer, stream])

  

  return (
    <div className="flex h-full gap-2">
      <div className="bg-background rounded-xl h-full w-full flex justify-center items-center border border-primary-border relative">
        <Player 
          playerId={myId}
          url={stream}
          muted
          playing
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute bottom-4 left-4 bg-primary-hover px-3 py-1.5 rounded-lg text-foreground text-sm">
          You
        </div>
      </div>
      <div className="bg-background rounded-xl h-full w-full flex justify-center items-center border border-primary-border relative">
        <video 
          id="user-2" 
          autoPlay 
          playsInline
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute bottom-4 left-4 bg-primary-hover px-3 py-1.5 rounded-lg text-foreground text-sm">
          Remote User
        </div>
      </div>
    </div>
  )
}

export default Screen
