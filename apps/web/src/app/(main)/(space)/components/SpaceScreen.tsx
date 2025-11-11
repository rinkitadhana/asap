"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "@/shared/context/socket";
import usePeer from "../hooks/usePeer";
import useMediaStream from "../hooks/useMediaStream";
import usePlayer from "../hooks/usePlayer";
import { useParams } from "next/navigation";
import { cloneDeep } from "lodash";
import { MediaConnection } from "peerjs";
import VideoCallControls from "./VideoCallControls";
import UserMedia from "./UserMedia";
import VideoGrid, { getGridLayout } from "./layout/VideoGrid";
import VideoContainer from "./layout/VideoContainer";
import PaginationControls from "./ui/PaginationControls";
import WaitingState from "./ui/WaitingState";
import { SpaceScreenProps } from "../types";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";

const SpaceScreen = ({
  toggleSidebar,
  activeSidebar,
  preJoinSettings,
}: SpaceScreenProps) => {
  const socket = useSocket();
  const params = useParams();
  const roomId = params.roomId as string;
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream(preJoinSettings || undefined);
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    toggleSpeaker,
    leaveRoom,
  } = usePlayer(myId || "", roomId || "", peer);
  const [currentPage, setCurrentPage] = useState(0);
  const [closeWaiting, setCloseWaiting] = useState(false);
  const [myFullScreen, setMyFullScreen] = useState(true);
  const [otherFullScreen, setOtherFullScreen] = useState(true);
  const [users, setUsers] = useState<Record<string, MediaConnection>>({});

  const USERS_PER_PAGE = 4;
  const otherPlayerIds = Object.keys(nonHighlightedPlayers);
  const totalPages = Math.ceil(otherPlayerIds.length / USERS_PER_PAGE);
  const startIndex = currentPage * USERS_PER_PAGE;
  const visibleOtherPlayers = otherPlayerIds.slice(
    startIndex,
    startIndex + USERS_PER_PAGE,
  );

  const gridLayout = getGridLayout(visibleOtherPlayers.length);

  useEffect(() => {
    if (!socket || !peer || !stream) {
      console.log("Socket, peer or stream not available yet");
      return;
    }
    const handleUserConnected = (newUserId: string) => {
      console.log(`User connected in a room with userID: ${newUserId}`);
      const call = peer.call(newUserId, stream);

      call.on("stream", (incomingStream: MediaStream) => {
        console.log(`Received stream from user ${newUserId}`);
        setPlayers((prev) => ({
          ...prev,
          [newUserId]: {
            url: incomingStream,
            muted: false,
            playing: true,
            speakerMuted: false,
            name: `User ${newUserId.slice(-4)}`,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [newUserId]: call,
        }));
      });
    };
    socket.on("user-connected", handleUserConnected);

    return () => {
      console.log("Cleaning up user-connected listener");
      socket.off("user-connected", handleUserConnected);
    };
  }, [socket, peer, stream, setPlayers]);

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
      users[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };
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

      call.on("stream", (incomingStream: MediaStream) => {
        console.log(`Received stream from user ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
            speakerMuted: false,
            name: `User ${callerId.slice(-4)}`,
          },
        }));
        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
  }, [peer, stream, setPlayers]);

  useEffect(() => {
    if (!stream || !myId) return;
    console.log(
      `Setting my stream ${myId} with pre-join settings:`,
      preJoinSettings,
    );
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: preJoinSettings ? !preJoinSettings.audioEnabled : false,
        playing: preJoinSettings ? preJoinSettings.videoEnabled : true,
        speakerMuted: false,
        name: preJoinSettings?.name || "You",
      },
    }));
  }, [stream, myId, preJoinSettings, setPlayers]);

  const renderMainUser = () => {
    if (!playerHighlighted) return null;

    const { url, muted, playing } = playerHighlighted;
    return (
      <VideoContainer
        isFullScreen={myFullScreen}
        onToggleFullScreen={() => setMyFullScreen((prev) => !prev)}
        showFullScreenButton={playerHighlighted.playing}
        className="flex-1 h-full min-w-0"
      >
        <UserMedia
          url={url}
          muted={muted}
          playing={playing}
          myVideo={true}
          name={playerHighlighted.name}
          className={`h-full w-full ${myFullScreen ? "object-cover" : "object-contain"}`}
          speakerMuted={playerHighlighted.speakerMuted}
        />
      </VideoContainer>
    );
  };

  const renderOtherUsers = () => {
    if (visibleOtherPlayers.length === 0) {
      return (
        <WaitingState
          onClose={() => setCloseWaiting(true)}
          isVisible={!closeWaiting}
        />
      );
    }

    return (
      <div className="flex-1 h-full min-w-0 relative group/other-screen group/pagination overflow-hidden">
        <VideoGrid layout={gridLayout}>
          {visibleOtherPlayers.map((playerId, index) => {
            const { url, muted, playing, speakerMuted } =
              nonHighlightedPlayers[playerId];

            // Special handling for 3 users layout (2 top, 1 bottom spanning full width)
            const isBottomSpanning = gridLayout.bottomSpan && index === 2;

            return (
              <div
                key={playerId}
                className={`bg-call-primary overflow-hidden rounded-xl border border-call-border relative ${
                  isBottomSpanning ? "col-span-2" : ""
                }`}
              >
                <UserMedia
                  url={url}
                  muted={muted}
                  playing={playing}
                  name={
                    nonHighlightedPlayers[playerId]?.name ||
                    `User ${index + 1 + currentPage * USERS_PER_PAGE}`
                  }
                  className={`h-full w-full ${otherFullScreen ? "object-cover" : "object-contain"}`}
                  speakerMuted={speakerMuted}
                />
              </div>
            );
          })}
        </VideoGrid>

        <button
          onClick={() => {
            setOtherFullScreen((prev) => !prev);
          }}
          className="select-none opacity-0 group-hover/other-screen:opacity-100 absolute bottom-0 right-0 p-2 m-2 rounded-xl bg-secondary hover:bg-primary-hover border border-call-border cursor-pointer transition-all duration-300"
        >
          {otherFullScreen ? (
            <RxExitFullScreen size={20} />
          ) : (
            <RxEnterFullScreen size={20} />
          )}
        </button>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
        <VideoCallControls
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
  );
};

export default SpaceScreen;
