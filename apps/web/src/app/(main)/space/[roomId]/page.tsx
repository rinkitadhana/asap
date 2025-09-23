"use client"
import React, { useState } from "react"
import SpaceWrapper from "../components/SpaceWrapper"
import PreJoinScreen from "../components/PreJoinScreen"
import { useParams } from "next/navigation"
import SpaceScreen from "../components/SpaceScreen"
import { SidebarType, PreJoinSettings } from "../types"

const Room = () => {
  const params = useParams()
  const roomId = params.roomId as string
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [preJoinSettings, setPreJoinSettings] = useState<PreJoinSettings | null>(null)

  const toggleSidebar = (sidebarType: SidebarType) => {
    if (activeSidebar === sidebarType) {
      setActiveSidebar(null)
    } else {
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

  if (!hasJoined) {
    return <PreJoinScreen onJoinCall={handleJoinCall} roomId={roomId} />
  }

  return (
    <SpaceWrapper activeSidebar={activeSidebar} closeSidebar={closeSidebar}>
      <SpaceScreen
        toggleSidebar={toggleSidebar}
        activeSidebar={activeSidebar}
        preJoinSettings={preJoinSettings}
      />
    </SpaceWrapper>
  )
}

export default Room
