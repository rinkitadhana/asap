"use client";
import React, { useEffect, useState } from "react";
import SpaceWrapper from "../components/SpaceWrapper";
import PreJoinScreen from "../components/PreJoinScreen";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import SpaceScreen from "../components/SpaceScreen";
import { SidebarType, PreJoinSettings } from "../types";
import { useGetMe } from "@/shared/hooks/useUserQuery";

const Room = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = useGetMe();
  const roomId = params.roomId as string;
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [preJoinSettings, setPreJoinSettings] =
    useState<PreJoinSettings | null>(null);

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

  // Check if host parameter is present and auto-join
  useEffect(() => {
    const isHost = searchParams.get("host") === "true";
    if (isHost && user) {
      // Auto-join with default settings (both camera and mic enabled)
      const defaultSettings: PreJoinSettings = {
        videoEnabled: true,
        audioEnabled: true,
        name: user.name || "Host",
        avatar: user.avatar,
      };
      handleJoinCall(defaultSettings);

      // Clean up the URL by removing the host parameter
      router.replace(`/${roomId}`);
    }
  }, [searchParams, user, roomId, router]);

  if (!hasJoined) {
    return <PreJoinScreen onJoinCall={handleJoinCall} roomId={roomId} />;
  }

  return (
    <SpaceWrapper activeSidebar={activeSidebar} closeSidebar={closeSidebar}>
      <SpaceScreen
        toggleSidebar={toggleSidebar}
        activeSidebar={activeSidebar}
        preJoinSettings={preJoinSettings}
      />
    </SpaceWrapper>
  );
};

export default Room;
