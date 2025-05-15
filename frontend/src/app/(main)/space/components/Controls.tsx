import { BsFillRecordCircleFill, BsFillTelephoneFill } from "react-icons/bs"
import { RiMic2Line } from "react-icons/ri"
import { FiVideo } from "react-icons/fi"
import { PiSpeakerHigh } from "react-icons/pi"
import { LuScreenShare } from "react-icons/lu"
const Controls = () => {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-secondary/60 backdrop-blur-sm p-2">
      <button className="flex gap-1.5 items-center justify-center px-3 h-10 rounded-[10px] bg-red-400 text-white font-medium text-sm cursor-pointer hover:bg-red-400/80 transition-all duration-200">
        <BsFillRecordCircleFill className="text-base" /> <span>Record</span>
      </button>
      <button className="flex items-center justify-center px-3 h-10 rounded-[10px] bg-primary-hover text-lg font-medium cursor-pointer hover:bg-primary-hover/80 transition-all duration-200">
        <RiMic2Line />
      </button>
      <button className="flex items-center justify-center px-3 h-10 rounded-[10px] bg-primary-hover text-lg font-medium cursor-pointer hover:bg-primary-hover/80 transition-all duration-200">
        <FiVideo />
      </button>
      <button className="flex items-center justify-center px-3 h-10 rounded-[10px] bg-primary-hover text-lg font-medium cursor-pointer hover:bg-primary-hover/80 transition-all duration-200">
        <PiSpeakerHigh />
      </button>
      <button className="flex items-center justify-center px-3 h-10 rounded-[10px] bg-primary-hover text-lg font-medium cursor-pointer hover:bg-primary-hover/80 transition-all duration-200">
        <LuScreenShare />
      </button>
      <button className="flex items-center justify-center px-3 h-10 rounded-[10px] text-lg font-medium cursor-pointer text-red-400 bg-red-400/20 hover:bg-red-400/30 transition-all duration-200">
        <BsFillTelephoneFill className="-rotate-[225deg]" />
      </button>
    </div>
  )
}

export default Controls
