import { BsFillRecordCircleFill, BsFillTelephoneFill } from "react-icons/bs"
import { RiMic2Line } from "react-icons/ri"
import { FiVideo } from "react-icons/fi"
import { LuScreenShare } from "react-icons/lu"
import { RxSpeakerLoud } from "react-icons/rx"

const Controls = () => {
  return (
    <div className="select-none flex items-center gap-2.5 p-2">
      <div className="flex flex-col gap-1 items-center">
        <button className="flex gap-1.5 items-center justify-center py-3 px-4 rounded-xl bg-red-400 text-white font-medium text-sm cursor-pointer hover:bg-red-400/80 transition-all duration-200">
          <BsFillRecordCircleFill className="text-base" /> <span>Record</span>
        </button>
        <p className="text-[0.675rem] text-foreground/50">Start</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <button className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
          <RiMic2Line />
        </button>
        <p className="text-[0.675rem] text-foreground/50">Mic</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <button className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
          <FiVideo />
        </button>
        <p className="text-[0.675rem] text-foreground/50">Cam</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <button className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
          <RxSpeakerLoud />
        </button>
        <p className="text-[0.675rem] text-foreground/50">Speaker</p>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <button className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
          <LuScreenShare />
        </button>
        <p className="text-[0.675rem] text-foreground/50">Share</p>
      </div>
      <div className="h-8 border-r border-primary-border mx-1 mb-4.5" />
      <div className="flex flex-col gap-1 items-center">
        <button className="flex items-center justify-center border border-red-400/10 p-3 rounded-xl text-lg font-medium cursor-pointer text-red-400 bg-red-400/20 hover:bg-red-400/40 transition-all duration-200">
          <BsFillTelephoneFill className="-rotate-[225deg]" />
        </button>
        <p className="text-[0.675rem] text-foreground/50">Leave</p>
      </div>
    </div>
  )
}

export default Controls
