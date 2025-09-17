'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import generateRoomId from '@/shared/utils/GenerateRoomId'
import { FaCalendarAlt, FaPlus, FaUserPlus, FaVideo } from 'react-icons/fa'

const Options = () => {
  const router = useRouter()
  const handleJoinRoom = () => {
    const roomId = generateRoomId()
    router.push(`/space/${roomId}`)
  }
  return (
    <div>
      <div className="flex gap-4 not-first:items-center h-[180px] w-full ">
        <div onClick={handleJoinRoom} className="relative flex-1 flex flex-col h-full items-center justify-center p-4 bg-[#e05334] hover:opacity-80 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/img/hero-dash/link1.jpg')] opacity-10 bg-cover bg-center bg-no-repeat" />
          <div className='absolute top-4 left-4 p-4 bg-white/20 rounded-xl'><FaPlus size={24} className='text-white' /></div>
          <div className='absolute bottom-4 left-4 flex flex-col gap-1 items-start justify-center'>
            <h1 className="text-xl font-bold text-white">New Meeting</h1>
            <p className="text-xs text-white/85 font-medium">Start a new meeting</p>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col h-full items-center justify-center p-4 bg-[#2e6aeb] hover:opacity-80 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/img/hero-dash/link3.jpg')] opacity-10 bg-cover bg-center bg-no-repeat" />
          <div className='absolute top-4 left-4 p-4 bg-white/20 rounded-xl'><FaUserPlus size={24} className='text-white' /></div>
          <div className='absolute bottom-4 left-4 flex flex-col gap-1 items-start justify-center'>
            <h1 className="text-xl font-bold text-white">Join Meeting</h1>
            <p className="text-xs text-white/85 font-medium">Via invitation link</p>
          </div>
        </div>
        <div className="relative flex-1 flex flex-col h-full items-center justify-center p-4 bg-[#9333EA] hover:opacity-80 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/img/hero-dash/link2.avif')] opacity-10 bg-cover bg-center bg-no-repeat" />
          <div className='absolute top-4 left-4 p-4 bg-white/20 rounded-xl'><FaCalendarAlt size={24} className='text-white' /></div>
          <div className='absolute bottom-4 left-4 flex flex-col gap-1 items-start justify-center'>
            <h1 className="text-xl font-bold text-white">Schedule Meeting</h1>
            <p className="text-xs text-white/85 font-medium">Plan your meeting</p>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col h-full items-center justify-center p-4 bg-[#c5a239] hover:opacity-80 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/img/hero-dash/link4.jpeg')] opacity-10 bg-cover bg-center bg-no-repeat" />
          <div className='absolute top-4 left-4 p-4 bg-white/20 rounded-xl'><FaVideo size={24} className='text-white' /></div>
          <div className='absolute bottom-4 left-4 flex flex-col gap-1 items-start justify-center'>
            <h1 className="text-xl font-bold text-white">View Recordings</h1>
            <p className="text-xs text-white/85 font-medium">Meeting recordings</p>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Options
