import { useState } from 'react'
import { cloneDeep } from 'lodash'
import { useSocket } from '@/context/socket';
import { useRouter } from 'next/navigation';
import { Peer } from 'peerjs';

interface Player {
  url: MediaStream | string;
  muted: boolean;
  playing: boolean;
  speakerMuted: boolean;
}

interface Players {
  [key: string]: Player;
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
      const newMutedState = !copy[myId].muted
      copy[myId].muted = newMutedState

      // Actually control the MediaStream audio track
      if (copy[myId].url instanceof MediaStream) {
        const audioTracks = copy[myId].url.getAudioTracks()
        audioTracks.forEach((track: MediaStreamTrack) => {
          track.enabled = !newMutedState // enabled is opposite of muted
        })
      }

      return { ...copy }
    })
    socket?.emit('user-toggle-audio', myId, roomId)
  }

  const toggleVideo = () => {
    console.log("I toggled my video")
    setPlayers((prev) => {
      const copy = cloneDeep(prev)
      const newPlayingState = !copy[myId].playing
      copy[myId].playing = newPlayingState

      // Actually control the MediaStream video track
      if (copy[myId].url instanceof MediaStream) {
        const videoTracks = copy[myId].url.getVideoTracks()
        videoTracks.forEach((track: MediaStreamTrack) => {
          track.enabled = newPlayingState
        })
      }

      return { ...copy }
    })
    socket?.emit('user-toggle-video', myId, roomId)
  }

  const toggleSpeaker = () => {
    console.log("I toggled my speaker")
    setPlayers((prev) => {
      const copy = cloneDeep(prev)
      copy[myId].speakerMuted = !copy[myId].speakerMuted
      return { ...copy }
    })
    socket?.emit('user-toggle-speaker', myId, roomId)
  }

  return { players, setPlayers, playerHighlighted, nonHighlightedPlayers, toggleAudio, toggleVideo, toggleSpeaker, leaveRoom }
}

export default usePlayer