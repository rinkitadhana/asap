import { BsFillRecordCircleFill, BsFillTelephoneFill } from "react-icons/bs"
import { RiMic2Line } from "react-icons/ri"
import { FiVideo } from "react-icons/fi"
import { LuScreenShare } from "react-icons/lu"
import { RxSpeakerLoud } from "react-icons/rx"

const Controls = () => {
  return (
    <div className="select-none flex items-center gap-2 p-2 my-1">
      <button className="flex gap-1.5 items-center justify-center py-3 px-4 rounded-xl bg-red-400 text-white font-medium text-sm cursor-pointer hover:bg-red-400/80 transition-all duration-200">
        <BsFillRecordCircleFill className="text-base" /> <span>Record</span>
      </button>
      <button className="flex items-center justify-center  border border-primary-border p-3 rounded-xl bg-primary-hover text-lg font-medium cursor-pointer hover:bg-primary-hover/80 transition-all duration-200">
        <RiMic2Line />
      </button>
      <button className="flex items-center justify-center border border-primary-border p-3 rounded-xl bg-primary-hover text-lg font-medium cursor-pointer hover:bg-primary-hover/80 transition-all duration-200">
        <FiVideo />
      </button>
      <button className="flex items-center justify-center border border-primary-border p-3 rounded-xl bg-primary-hover text-lg font-medium cursor-pointer hover:bg-primary-hover/80 transition-all duration-200">
        <RxSpeakerLoud />
      </button>
      <button className="flex items-center justify-center border border-primary-border p-3 rounded-xl bg-primary-hover text-lg font-medium cursor-pointer hover:bg-primary-hover/80 transition-all duration-200">
        <LuScreenShare />
      </button>
      <div className="h-8 border-r border-primary-border mx-1" />
      <button className="flex items-center justify-center border border-red-400/10 p-3 rounded-xl text-lg font-medium cursor-pointer text-red-400 bg-red-400/20 hover:bg-red-400/30 transition-all duration-200">
        <BsFillTelephoneFill className="-rotate-[225deg]" />
      </button>
    </div>
  )
}

export default Controls
