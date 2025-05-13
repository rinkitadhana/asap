"use client"
import { useParams } from "next/navigation"
import React from "react"
import SpaceWrapper from "../components/SpaceWrapper"
import Screen from "../components/Screen"

const Room = () => {
  const { username } = useParams()
  return (
    <SpaceWrapper>
      <Screen />
    </SpaceWrapper>
  )
}

export default Room
