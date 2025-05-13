"use client"
import { useParams } from "next/navigation"
import React from "react"
import SpaceWrapper from "../components/SpaceWrapper"

const Room = () => {
  const { username } = useParams()
  return (
    <SpaceWrapper>
      <div>{username}'s Room</div>
    </SpaceWrapper>
  )
}

export default Room
