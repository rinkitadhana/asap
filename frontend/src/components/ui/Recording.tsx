import { Disc2 } from "lucide-react"
import React from "react"

const Recording = () => {
  return (
    <div className="select-none flex gap-2 justify-center items-center border border-border px-3 py-1 text-xs my-3 rounded-full drop-shadow-xs bg-white dark:bg-black">
      <Disc2 className="text-red-500 animate-pulse" size={14} />
      <span>Recording</span>
    </div>
  )
}

export default Recording
