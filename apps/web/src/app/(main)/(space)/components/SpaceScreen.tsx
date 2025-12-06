/**
 * COMPONENT: SpaceScreen
 * 
 * PURPOSE:
 * The main orchestrator of the video calling experience. Combines all hooks and
 * manages the complete WebRTC connection flow.
 * 
 * WEBRTC CONNECTION FLOW (simplified):
 * 1. Get your camera/mic (useMediaStream)
 * 2. Create peer instance (usePeer) → get peer ID
 * 3. Join room via Socket.IO → tell server you're here
 * 4. When new user joins:
 *    a. You call them with peer.call(theirId, yourStream)
 *    b. They receive your stream
 *    c. They answer with their stream
 *    d. You receive their stream
 * 5. When you receive incoming call:
 *    a. Answer with your stream
 *    b. Receive their stream
 * 6. Both users now have bidirectional audio/video
 * 
 * STATE MANAGEMENT:
 * - players: Map of all participants and their streams
 * - users: Map of active peer connections (for cleanup)
 * - currentPage: Pagination for participant grid
 * - fullScreen states: Object-fit mode for videos
 */

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
  // ============================================================================
  // SETUP & HOOKS
  // ============================================================================
  
  const socket = useSocket();
  const params = useParams();
  const roomId = params.roomId as string;
  
  // Get peer instance and peer ID
  const { peer, myId } = usePeer();
  
  // Get camera/microphone stream
  const { stream } = useMediaStream(preJoinSettings || undefined);
  
  // Get player management functions
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

  // UI state
  const [currentPage, setCurrentPage] = useState(0);
  const [closeWaiting, setCloseWaiting] = useState(false);
  const [myFullScreen, setMyFullScreen] = useState(true);
  const [otherFullScreen, setOtherFullScreen] = useState(true);
  
  // Track active peer connections for cleanup when users leave
  const [users, setUsers] = useState<Record<string, MediaConnection>>({});

  // Pagination logic for participant grid
  const USERS_PER_PAGE = 4;
  const otherPlayerIds = Object.keys(nonHighlightedPlayers);
  const totalPages = Math.ceil(otherPlayerIds.length / USERS_PER_PAGE);
  const startIndex = currentPage * USERS_PER_PAGE;
  const visibleOtherPlayers = otherPlayerIds.slice(
    startIndex,
    startIndex + USERS_PER_PAGE,
  );

  const gridLayout = getGridLayout(visibleOtherPlayers.length);

  // ============================================================================
  // WEBRTC: HANDLE NEW USER JOINING (OUTGOING CALL)
  // ============================================================================
  
  /**
   * When socket server notifies us that a new user joined:
   * 1. Call them with our stream
   * 2. Wait for their stream in response
   * 3. Add their stream to our players state
   * 
   * This runs when OTHER users join AFTER you
   */
  useEffect(() => {
    if (!socket || !peer || !stream) return;

    const handleUserConnected = (newUserId: string) => {
      console.log(`[WebRTC] New user joined: ${newUserId}, initiating call...`);
      
      // Initiate call to the new user with our stream
      const call = peer.call(newUserId, stream);

      // When we receive their stream
      call.on("stream", (incomingStream: MediaStream) => {
        console.log(`[WebRTC] Received stream from ${newUserId}`);
        
        // Add them to our players state
        setPlayers((prev) => ({
          ...prev,
          [newUserId]: {
            url: incomingStream,
            muted: false,
            playing: true,
            speakerMuted: false,
            name: `User ${newUserId.slice(-4)}`,
            avatar: undefined,
          },
        }));

        // Store the call connection for cleanup later
        setUsers((prev) => ({
          ...prev,
          [newUserId]: call,
        }));
      });
    };

    socket.on("user-connected", handleUserConnected);

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [socket, peer, stream, setPlayers]);

  // ============================================================================
  // SOCKET.IO: HANDLE MEDIA CONTROL EVENTS
  // ============================================================================
  
  /**
   * Listen for other users toggling their audio/video/speaker
   * Update their state in our players object so UI reflects changes
   */
  useEffect(() => {
    if (!socket) return;

    // User muted/unmuted their mic
    const handleToggleAudio = (userId: string) => {
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return copy;
      });
    };

    // User turned camera on/off
    const handleToggleVideo = (userId: string) => {
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return copy;
      });
    };

    // User muted/unmuted their speaker
    const handleToggleSpeaker = (userId: string) => {
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].speakerMuted = !copy[userId].speakerMuted;
        return copy;
      });
    };

    // User left the call
    const handleUserLeave = (userId: string) => {
      console.log(`[WebRTC] User ${userId} left the call`);
      
      // Close the peer connection
      users[userId]?.close();
      
      // Remove them from players state
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };

    // Register all event listeners
    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-toggle-speaker", handleToggleSpeaker);
    socket.on("user-leave", handleUserLeave);

    // Cleanup listeners on unmount
    return () => {
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-toggle-speaker", handleToggleSpeaker);
      socket.off("user-leave", handleUserLeave);
    };
  }, [setPlayers, socket, users, players]);

  // ============================================================================
  // WEBRTC: ANSWER INCOMING CALLS
  // ============================================================================
  
  /**
   * When someone calls us (we joined AFTER them):
   * 1. Answer with our stream
   * 2. Receive their stream
   * 3. Add their stream to our players state
   * 
   * This runs when YOU join and others are already there
   */
  useEffect(() => {
    if (!peer || !stream) return;

    peer.on("call", (call) => {
      const { peer: callerId } = call;
      console.log(`[WebRTC] Receiving call from ${callerId}, answering...`);
      
      // Answer the call with our stream
      call.answer(stream);

      // When we receive their stream
      call.on("stream", (incomingStream: MediaStream) => {
        console.log(`[WebRTC] Received stream from ${callerId}`);
        
        // Add them to our players state
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: false,
            playing: true,
            speakerMuted: false,
            name: `User ${callerId.slice(-4)}`,
            avatar: undefined,
          },
        }));

        // Store the call connection for cleanup
        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
  }, [peer, stream, setPlayers]);

  // ============================================================================
  // ADD YOUR OWN STREAM TO PLAYERS
  // ============================================================================
  
  /**
   * Once we have our stream and peer ID, add ourselves to the players state
   * This displays our own video in the UI
   */
  useEffect(() => {
    if (!stream || !myId) return;

    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: preJoinSettings ? !preJoinSettings.audioEnabled : false,
        playing: preJoinSettings ? preJoinSettings.videoEnabled : true,
        speakerMuted: false,
        name: preJoinSettings?.name || "You",
        avatar: preJoinSettings?.avatar,
      },
    }));
  }, [stream, myId, preJoinSettings, setPlayers]);

  // ============================================================================
  // RENDER: YOUR VIDEO (FEATURED/HIGHLIGHTED)
  // ============================================================================
  
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
          avatar={playerHighlighted.avatar}
          className={`h-full w-full ${myFullScreen ? "object-cover" : "object-contain"}`}
          speakerMuted={playerHighlighted.speakerMuted}
        />
      </VideoContainer>
    );
  };

  // ============================================================================
  // RENDER: OTHER USERS (GRID)
  // ============================================================================
  
  const renderOtherUsers = () => {
    // Show waiting state if no other users
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
            const { url, muted, playing, speakerMuted, avatar } =
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
                  avatar={avatar}
                  className={`h-full w-full ${otherFullScreen ? "object-cover" : "object-contain"}`}
                  speakerMuted={speakerMuted}
                />
              </div>
            );
          })}
        </VideoGrid>

        {/* Fullscreen toggle button for other users grid */}
        <button
          onClick={() => setOtherFullScreen((prev) => !prev)}
          className="select-none opacity-0 group-hover/other-screen:opacity-100 absolute bottom-0 right-0 p-2 m-2 rounded-xl bg-secondary hover:bg-primary-hover border border-call-border cursor-pointer transition-all duration-300"
        >
          {otherFullScreen ? (
            <RxExitFullScreen size={20} />
          ) : (
            <RxEnterFullScreen size={20} />
          )}
        </button>

        {/* Pagination controls (if more than 4 users) */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Video area: Your video + Others grid */}
      <div className="flex h-full w-full gap-2 flex-1 min-h-0 pb-2">
        {renderMainUser()}
        {renderOtherUsers()}
      </div>

      {/* Control bar: Mic, Camera, Leave, etc. */}
      <div className="w-full flex-shrink-0 py-2">
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
