import { useState } from 'react'
import { cloneDeep } from 'lodash'

interface Players {
  [key: string]: any;
}

const usePlayer = (myId: string) => {
  const [players, setPlayer] = useState<Players>({});
  const playersCopy = cloneDeep(players)
  const playerHighlighted = playersCopy[myId]
  delete playersCopy[myId]
  const nonHighlightedPlayers = playersCopy

  return { players, setPlayer, playerHighlighted, nonHighlightedPlayers }
}

export default usePlayer