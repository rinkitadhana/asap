"use client"
import React, { useEffect } from "react"
import { useSocket } from "@/context/socket"
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import usePlayer from "@/hooks/usePlayer";
import Player from "./Player";

const Screen = () => {
  const socket = useSocket();
  const {peer, myId} = usePeer();
  const {stream} = useMediaStream();
  const {players, setPlayer} = usePlayer();

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
        setPlayer((prev: any)=>({
          ...prev,
          [newUserId]: {
          url: incomingStream, 
          muted: false,
          playing: true,
          }
        }))
        
      })
    }
    socket.on("user-connected", handleUserConnected);
    
    return () =>{
      console.log("Cleaning up user-connected listener");
      socket.off("user-connected", handleUserConnected);
    }
  }, [socket, peer, stream, setPlayer])

  useEffect(()=>{
    if (!peer || !stream) return;
    peer.on("call", (call)=>{
      const {peer: callerId} =call;
      call.answer(stream);

      call.on('stream', (incomingStream: MediaStream)=>{
        console.log(`Received stream from user ${callerId}`);
        setPlayer((prev: any)=>({
          ...prev,
          [callerId]: {
          url: incomingStream, 
          muted: false,
          playing: true,
          }
        }))
      })
    })
  }, [peer, stream])

  useEffect(()=>{
    if(!stream || !myId) return;
    console.log(`Setting my stream ${myId}`);
    setPlayer((prev: any)=>({
      ...prev,
      [myId]: {
        url: stream, 
        muted: false,
        playing: true,
      }
    }))
  }, [stream, myId, setPlayer])

  

  return (
    <div className="flex h-full gap-2">
      {players && Object.keys(players).map((playerId)=>{
        const {url, muted, playing} = players[playerId as keyof typeof players];
        return (
          <div key={playerId} className="bg-background overflow-hidden rounded-xl h-full w-full flex justify-center items-center border border-primary-border relative">
            <Player 
              url={url}
              muted={muted}
              playing={playing}
              className="h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-primary-hover px-3 py-1.5 rounded-lg text-foreground text-sm">
              {playerId === myId ? "You" : "Remote User"}
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default Screen
