'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import  generateRoomId  from '@/utils/GenerateRoomId'

const Options = () => {
    const router = useRouter()
    const handleJoinRoom = () =>{
      const roomId = generateRoomId()
      router.push(`/space/${roomId}`)
    }
  return (
    <button onClick={handleJoinRoom} className='flex items-center px-4 py-2 border rounded-lg bg-background hover:bg-background/80 w-fit mx-5 cursor-pointer'>
      Join Room
    </button>
  )
}

export default Options
