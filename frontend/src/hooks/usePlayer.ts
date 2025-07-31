import { useState } from 'react'
import { cloneDeep } from 'lodash'
import { useSocket } from '@/context/socket';
import { useRouter } from 'next/navigation';
import { Peer } from 'peerjs';

interface Players {
  [key: string]: any;
}

const usePlayer = (myId: string, roomId: string, peer: Peer | null) => {
  const socket = useSocket();
  const router = useRouter();
  const [players, setPlayers] = useState<Players>({});
  const playersCopy = cloneDeep(players)
  const playerHighlighted = playersCopy[myId]
  delete playersCopy[myId]
  const nonHighlightedPlayers = playersCopy

  const leaveRoom = () => {
    socket?.emit('user-leave', myId, roomId)
    console.log("leaving room", roomId)
    peer?.disconnect();
    router.push('/dashboard')
  }

  const toggleAudio = () => {
    console.log("I toggled my audio")
    setPlayers((prev) => {
      const copy = cloneDeep(prev)
      copy[myId].muted = !copy[myId].muted
      return { ...copy }
    })
    socket?.emit('user-toggle-audio', myId, roomId)
  }

  const toggleVideo = () => {
    console.log("I toggled my video")
    setPlayers((prev) => {
      const copy = cloneDeep(prev)
      copy[myId].playing = !copy[myId].playing
      return { ...copy }
    })
    socket?.emit('user-toggle-video', myId, roomId)
  }

  return { players, setPlayers, playerHighlighted, nonHighlightedPlayers, toggleAudio, toggleVideo, leaveRoom }
}

export default usePlayer