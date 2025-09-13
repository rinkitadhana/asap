"use client"
import React, { useState } from "react"
import SpaceWrapper from "../components/SpaceWrapper"
import Screen from "../components/Screen"
import PreJoinScreen from "../components/PreJoinScreen"
import { useParams } from "next/navigation"

type SidebarType = 'info' | 'users' | 'chat' | null

interface PreJoinSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
  username: string;
}

const Room = () => {
  const params = useParams()
  const roomId = params.roomId as string
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [preJoinSettings, setPreJoinSettings] = useState<PreJoinSettings | null>(null)

  const toggleSidebar = (sidebarType: SidebarType) => {
    if (activeSidebar === sidebarType) {
      // If clicking the same button, close the sidebar
      setActiveSidebar(null)
    } else {
      // If clicking a different button, switch to that sidebar
      setActiveSidebar(sidebarType)
    }
  }

  const closeSidebar = () => {
    setActiveSidebar(null)
  }

  const handleJoinCall = (settings: PreJoinSettings) => {
    setPreJoinSettings(settings)
    setHasJoined(true)
  }

  // Show pre-join screen if user hasn't joined yet
  if (!hasJoined) {
    return <PreJoinScreen onJoinCall={handleJoinCall} roomId={roomId} />
  }

  // Show main call interface after joining
  return (
    <SpaceWrapper activeSidebar={activeSidebar} closeSidebar={closeSidebar}>
      <Screen
        toggleSidebar={toggleSidebar}
        activeSidebar={activeSidebar}
        preJoinSettings={preJoinSettings}
      />
    </SpaceWrapper>
  )
}

export default Room
