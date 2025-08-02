"use client"
import React, { useState } from "react"
import SpaceWrapper from "../components/SpaceWrapper"
import Screen from "../components/Screen"

type SidebarType = 'info' | 'users' | 'chat' | null

const Room = () => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType>(null)

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

  return (
    <SpaceWrapper activeSidebar={activeSidebar} closeSidebar={closeSidebar}>
      <Screen toggleSidebar={toggleSidebar} activeSidebar={activeSidebar} />
    </SpaceWrapper>
  )
}

export default Room
