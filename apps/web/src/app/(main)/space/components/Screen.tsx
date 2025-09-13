"use client"
import React, { useEffect, useState } from "react"
import { useSocket } from "@/context/socket"
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import usePlayer from "@/hooks/usePlayer";
import Player from "./Player";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";
import { useParams } from "next/navigation";
import Controls from "./Controls";
import { cloneDeep } from 'lodash'
import { MediaConnection } from 'peerjs';

interface PreJoinSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
  username: string;
}

interface ScreenProps {
  toggleSidebar: (sidebarType: SidebarType) => void
  activeSidebar: SidebarType
  preJoinSettings: PreJoinSettings | null
}
type SidebarType = 'info' | 'users' | 'chat' | null

const Screen = ({ toggleSidebar, activeSidebar, preJoinSettings }: ScreenProps) => {
  const socket = useSocket();
  const params = useParams();
  const roomId = params.roomId as string;
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream(preJoinSettings || undefined);
  const { players, setPlayers, playerHighlighted, nonHighlightedPlayers, toggleAudio, toggleVideo, toggleSpeaker, leaveRoom } = usePlayer(myId || "", roomId || "", peer);
  const [currentPage, setCurrentPage] = useState(0);
  const [closeWaiting, setCloseWaiting] = useState(false);
  const [myFullScreen, setMyFullScreen] = useState(true);
  const [otherFullScreen, setOtherFullScreen] = useState(true);
  const [users, setUsers] = useState<Record<string, MediaConnection>>({});

  const USERS_PER_PAGE = 4;
  const otherPlayerIds = Object.keys(nonHighlightedPlayers);
  const totalPages = Math.ceil(otherPlayerIds.length / USERS_PER_PAGE);
  const startIndex = currentPage * USERS_PER_PAGE;
  const visibleOtherPlayers = otherPlayerIds.slice(startIndex, startIndex + USERS_PER_PAGE);

  // Calculate layout for right side based on number of users
  const getGridLayout = (userCount: number) => {
    if (userCount === 0) return { rows: 0, cols: 0 };
    if (userCount === 1) return { rows: 1, cols: 1 };
    if (userCount === 2) return { rows: 2, cols: 1 };
    if (userCount === 3) return { rows: 2, cols: 2, bottomSpan: true };
    if (userCount === 4) return { rows: 2, cols: 2 };
    return { rows: 2, cols: 2 }; // fallback
  };

  const gridLayout = getGridLayout(visibleOtherPlayers.length);

  useEffect(() => {
    if (!socket || !peer || !stream) {
      console.log("Socket, peer or stream not available yet");
      return;
    }
    const handleUserConnected = (newUserId: string) => {
      console.log(`User connected in a room with userID: ${newUserId}`)
      const call = peer.call(newUserId, stream);

      call.on('stream', (incomingStream: MediaStream) => {
        console.log(`Received stream from user ${newUserId}`);
        setPlayers((prev) => ({
          ...prev,
          [newUserId]: {
            url: incomingStream,
            muted: false,
            playing: true,
            speakerMuted: false,
            username: `User ${newUserId.slice(-4)}`,
          }
        }))

        setUsers((prev) => ({
          ...prev,
          [newUserId]: call
        }))

      })
    }
    socket.on("user-connected", handleUserConnected);

    return () => {
      console.log("Cleaning up user-connected listener");
      socket.off("user-connected", handleUserConnected);
    }
  }, [socket, peer, stream, setPlayers])

  useEffect(() => {
    if (!socket) return;
    const handleToggleAudio = (userId: string) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId: string) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handleToggleSpeaker = (userId: string) => {
      console.log(`user with id ${userId} toggled speaker`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].speakerMuted = !copy[userId].speakerMuted;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId: string) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close()
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    }
    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-toggle-speaker", handleToggleSpeaker);
    socket.on("user-leave", handleUserLeave);
    return () => {
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-toggle-speaker", handleToggleSpeaker);
      socket.off("user-leave", handleUserLeave);
    };
  }, [setPlayers, socket, users, players]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);

      call.on('stream', (incomingStream: MediaStream) => {
        console.log(`Received stream from user ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
            speakerMuted: false,
            username: `User ${callerId.slice(-4)}`,
          }
        }))
        setUsers((prev) => ({
          ...prev,
          [callerId]: call
        }))
      })
    })
  }, [peer, stream, setPlayers])

  useEffect(() => {
    if (!stream || !myId) return;
    console.log(`Setting my stream ${myId} with pre-join settings:`, preJoinSettings);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: preJoinSettings ? !preJoinSettings.audioEnabled : false,
        playing: preJoinSettings ? preJoinSettings.videoEnabled : true,
        speakerMuted: false,
        username: preJoinSettings?.username || 'You',
      }
    }))
  }, [stream, myId, preJoinSettings, setPlayers]);

  const renderMainUser = () => {
    if (!playerHighlighted) return null;

    const { url, muted, playing } = playerHighlighted;
    return (
      <div className="flex-1 h-full min-w-0 relative group/my-screen overflow-hidden">
        <div className="bg-call-primary overflow-hidden rounded-2xl h-full w-full border border-call-border relative">
          <Player
            url={url}
            muted={muted}
            playing={playing}
            myVideo={true}
            username={playerHighlighted.username}
            className={`h-full w-full ${myFullScreen ? 'object-cover' : 'object-contain'}`}
            speakerMuted={playerHighlighted.speakerMuted}
          />
        </div>
        {playerHighlighted.playing &&
          <button onClick={() => { setMyFullScreen(prev => !prev) }} className="select-none opacity-0 group-hover/my-screen:opacity-100 absolute bottom-0 right-0 p-2 m-2 rounded-xl bg-secondary hover:bg-primary-hover border border-call-border cursor-pointer transition-all duration-300">
            {myFullScreen ? <RxExitFullScreen size={20} /> : <RxEnterFullScreen size={20} />}
          </button>
        }

      </div>
    );
  };

  const renderOtherUsers = () => {
    if (visibleOtherPlayers.length === 0) {
      return (
        <div className={`flex-1 h-full min-w-0 relative group/close overflow-hidden ${closeWaiting ? 'hidden' : ''}`}>
          <div className="bg-call-primary border border-call-border rounded-2xl h-full w-full flex justify-center items-center">
            <div className="text-muted-foreground text-lg">Waiting for others to join...</div>
          </div>
          <button onClick={() => setCloseWaiting(true)} className="select-none opacity-0 group-hover/close:opacity-100 absolute top-0 right-0 p-1.5 m-2 rounded-full bg-secondary hover:bg-primary-hover border border-call-border cursor-pointer transition-all duration-300">
            <X size={18} />
          </button>
        </div>
      );
    }

    return (
      <div className="flex-1 h-full min-w-0 relative group/other-screen group/pagination overflow-hidden">
        <div className="grid h-full gap-2" style={{
          gridTemplateRows: gridLayout.rows === 1 ? '1fr' :
            gridLayout.rows === 2 ? '1fr 1fr' :
              '1fr 1fr 1fr',
          gridTemplateColumns: gridLayout.cols === 1 ? '1fr' :
            gridLayout.cols === 2 ? '1fr 1fr' :
              '1fr 1fr 1fr'
        }}>
          {visibleOtherPlayers.map((playerId, index) => {
            const { url, muted, playing, speakerMuted } = nonHighlightedPlayers[playerId];

            // Special handling for 3 users layout (2 top, 1 bottom spanning full width)
            const isBottomSpanning = gridLayout.bottomSpan && index === 2;

            return (
              <div
                key={playerId}
                className={`bg-call-primary overflow-hidden rounded-xl border border-call-border relative ${isBottomSpanning ? 'col-span-2' : ''
                  }`}
              >
                <Player
                  url={url}
                  muted={muted}
                  playing={playing}
                  username={nonHighlightedPlayers[playerId]?.username || `User ${index + 1 + (currentPage * USERS_PER_PAGE)}`}
                  className={`h-full w-full ${otherFullScreen ? 'object-cover' : 'object-contain'}`}
                  speakerMuted={speakerMuted}
                />
              </div>
            );
          })}
        </div>

        <div onClick={() => { setOtherFullScreen(prev => !prev) }} className="select-none opacity-0 group-hover/other-screen:opacity-100 absolute bottom-0 right-0 p-2 m-2 rounded-xl bg-secondary hover:bg-primary-hover border border-call-border cursor-pointer transition-all duration-300">
          {otherFullScreen ? <RxExitFullScreen size={20} /> : <RxEnterFullScreen size={20} />}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <>
            {/* Previous Page Button - Left Side */}
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="select-none opacity-0 group-hover/pagination:opacity-100 absolute left-5 top-1/2 transform -translate-y-1/2 -translate-x-1/2 p-2 rounded-xl bg-secondary/80 backdrop-blur-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-call-border cursor-pointer "
              title="Previous page"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next Page Button - Right Side */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="select-none opacity-0 group-hover/pagination:opacity-100 absolute right-5 top-1/2 transform -translate-y-1/2 translate-x-1/2 p-2 rounded-xl bg-secondary/80 backdrop-blur-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-call-border cursor-pointer"
              title="Next page"
            >
              <ChevronRight size={20} />
            </button>

            {/* Page Indicator - Top Right Corner */}
            <div className="hidden group-hover/pagination:block absolute top-2 right-2 bg-secondary/80 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-foreground border border-call-border">
              {currentPage + 1} / {totalPages}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex h-full w-full gap-2 flex-1 min-h-0 pb-2">
        {renderMainUser()}
        {renderOtherUsers()}
      </div>
      <div className="w-full flex-shrink-0 py-2 ">
        <Controls
          muted={playerHighlighted?.muted}
          playing={playerHighlighted?.playing}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          leaveRoom={leaveRoom}
          speakerMuted={playerHighlighted?.speakerMuted}
          toggleSpeaker={toggleSpeaker}
          toggleSidebar={toggleSidebar}
          activeSidebar={activeSidebar}
        />
      </div>
    </div>
  )
}

export default Screen
