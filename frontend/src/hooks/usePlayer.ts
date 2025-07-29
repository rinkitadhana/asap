import { useState } from 'react'

const usePlayer = () => {
    const [players, setPlayer] = useState({});
  return {players, setPlayer}
}

export default usePlayer
