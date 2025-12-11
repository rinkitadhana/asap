"use client";
import React, { useEffect, useState } from "react";
import SpaceWrapper from "../components/SpaceWrapper";
import PreJoinScreen from "../components/PreJoinScreen";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import SpaceScreen from "../components/SpaceScreen";
import { useGetMe } from "@/shared/hooks/useUserQuery";
import { useCreateSpace } from "@/shared/hooks/useSpace";
import { useJoinSpace } from "@/shared/hooks/useParticipant";
import usePeer from "@/shared/hooks/usePeer";
import { getOrCreateSessionId } from "@/shared/utils/ParticipantSessionId";

type SidebarType = "info" | "users" | "chat" | null;

export interface PreJoinSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
  name: string;
  avatar?: string;
}

const Room = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = useGetMe();
  const { myId } = usePeer();
  const createSpace = useCreateSpace();
  const roomId = params.roomId as string;
  const isHost = searchParams.get("host") === "true";
  const [createdSpaceId, setCreatedSpaceId] = useState<string | null>(null);
  const joinSpace = useJoinSpace(createdSpaceId || "");
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [preJoinSettings, setPreJoinSettings] =
    useState<PreJoinSettings | null>(null);
  const [spaceCreated, setSpaceCreated] = useState(false);
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);

  const participantSessionId = getOrCreateSessionId(roomId);

  const toggleSidebar = (sidebarType: SidebarType) => {
    if (activeSidebar === sidebarType) {
      setActiveSidebar(null);
    } else {
      setActiveSidebar(sidebarType);
    }
  };

  const closeSidebar = () => {
    setActiveSidebar(null);
  };

  const handleJoinCall = (settings: PreJoinSettings) => {
    setPreJoinSettings(settings);
    setHasJoined(true);
  };

  // Check if host parameter is present and create space
  useEffect(() => {
    if (isHost && user && myId && !spaceCreated && !isCreatingSpace) {
      setIsCreatingSpace(true);

      // Create the space first
      createSpace.mutate(
        {
          joinCode: roomId,
          participantSessionId: participantSessionId,
        },
        {
          onSuccess: (spaceData) => {
            console.log("Space created successfully");
            setSpaceCreated(true);
            setCreatedSpaceId(spaceData.id);

            // Auto-join with default settings (both camera and mic enabled)
            const defaultSettings: PreJoinSettings = {
              videoEnabled: true,
              audioEnabled: true,
              name: user.name || "Host",
              avatar: user.avatar,
            };

            // Call join space API for the host
            joinSpace.mutate(
              {
                displayName: defaultSettings.name,
                participantSessionId: participantSessionId,
              },
              {
                onSuccess: () => {
                  console.log("Host joined space successfully");
                  setIsCreatingSpace(false);
                  handleJoinCall(defaultSettings);

                  // Clean up the URL by removing the host parameter
                  router.replace(`/${roomId}`);
                },
                onError: (error) => {
                  console.error("Failed to join space as host:", error);
                  setIsCreatingSpace(false);
                  // Even if join fails, let them into the space since they created it
                  handleJoinCall(defaultSettings);
                  router.replace(`/${roomId}`);
                },
              }
            );
          },
          onError: (error) => {
            console.error("Failed to create space:", error);
            setIsCreatingSpace(false);
            // Redirect to dashboard on error
            router.push("/dashboard/home");
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isHost,
    user,
    myId,
    roomId,
    router,
    createSpace,
    spaceCreated,
    isCreatingSpace,
    participantSessionId,
    // joinSpace is intentionally omitted as it's only used in callback
  ]);

  // Show loading screen for host while creating space
  if (isHost && isCreatingSpace) {
    return (
      <div className="bg-call-background h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Show pre-join screen for non-hosts
  if (!hasJoined && !isHost) {
    return <PreJoinScreen onJoinCall={handleJoinCall} roomId={roomId} />;
  }

  // Show space screen after joining
  if (hasJoined) {
    return (
      <SpaceWrapper activeSidebar={activeSidebar} closeSidebar={closeSidebar}>
        <SpaceScreen
          toggleSidebar={toggleSidebar}
          activeSidebar={activeSidebar}
          preJoinSettings={preJoinSettings}
        />
      </SpaceWrapper>
    );
  }

  // Fallback loading state
  return (
    <div className="bg-call-background h-screen flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
};

export default Room;
