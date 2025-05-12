"use client"
import { useParams } from "next/navigation"
import React from "react"

const Room = () => {
  const { username } = useParams()
  return <div>{username}'s Room</div>
}

export default Room
