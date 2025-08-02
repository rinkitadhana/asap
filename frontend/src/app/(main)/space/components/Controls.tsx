import { BsFillRecordCircleFill, BsFillTelephoneFill, BsInfoLg } from "react-icons/bs"
import { RiMicLine, RiMicOffLine } from "react-icons/ri"
import { FiVideo, FiVideoOff } from "react-icons/fi"
import { LuLayoutDashboard, LuScreenShare, LuUsers } from "react-icons/lu"
import { RxSpeakerLoud } from "react-icons/rx"
import DateComponent from "@/utils/Date"
import { IoChatbubbleOutline } from "react-icons/io5"
const Controls = (props: { muted: boolean, playing: boolean, toggleAudio: () => void, toggleVideo: () => void, leaveRoom: () => void }) => {
  const { muted, playing, toggleAudio, toggleVideo, leaveRoom } = props;

  const playClickSound = () => {
    try {
      // Use Web Audio API for discrete sound effects that don't interfere with browser media controls
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      fetch('/audio/click.mp3')
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(audioBuffer => {
          const source = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();

          source.buffer = audioBuffer;
          gainNode.gain.value = 0.6; // Set volume to 60%

          source.connect(gainNode);
          gainNode.connect(audioContext.destination);

          source.start(0);

          // Clean up after audio finishes
          source.onended = () => {
            audioContext.close();
          };
        })
        .catch(error => {
          console.error("Error playing click sound:", error);
        });
    } catch (error) {
      // Fallback to simple HTML5 audio if Web Audio API is not supported
      const audio = new Audio('/audio/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(err => console.error("Audio fallback error:", err));
    }
  }

  return (
    <div className="relative flex w-full justify-between items-center">
      <div>
        <DateComponent className="" />
      </div>
      <div className="select-none flex items-center gap-2.5 p-2 absolute left-1/2 -translate-x-1/2">
        <div className="flex flex-col gap-1 items-center">
          <button className="flex gap-1.5 items-center justify-center py-3 px-4 rounded-xl bg-red-400 text-white font-medium text-sm cursor-pointer hover:bg-red-400/80 transition-all duration-200">
            <BsFillRecordCircleFill className="text-base" /> <span>Record</span>
          </button>
          <p className="text-[0.675rem] text-foreground/50">Start</p>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <button onClick={() => {
            toggleAudio()
            playClickSound()
          }} className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
            {muted ? <RiMicOffLine /> : <RiMicLine />}
          </button>
          <p className="text-[0.675rem] text-foreground/50">Mic</p>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <button onClick={() => {
            toggleVideo()
            playClickSound()
          }} className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
            {playing ? <FiVideo /> : <FiVideoOff />}
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
          <button onClick={leaveRoom} className="flex items-center justify-center border border-red-400/10 p-3 rounded-xl text-lg font-medium cursor-pointer text-red-400 bg-red-400/20 hover:bg-red-400/40 transition-all duration-200">
            <BsFillTelephoneFill className="-rotate-[225deg]" />
          </button>
          <p className="text-[0.675rem] text-foreground/50">Leave</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1 items-center">
          <button className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
            <BsInfoLg />
          </button>
          <p className="text-[0.675rem] text-foreground/50">Info</p>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <button className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
            <LuLayoutDashboard />
          </button>
          <p className="text-[0.675rem] text-foreground/50">Layout</p>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <button className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
            <LuUsers />
          </button>
          <p className="text-[0.675rem] text-foreground/50">Users</p>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <button className="flex items-center justify-center border border-call-border p-3 rounded-xl bg-call-primary text-lg font-medium cursor-pointer hover:bg-primary-hover transition-all duration-200">
            <IoChatbubbleOutline />
          </button>
          <p className="text-[0.675rem] text-foreground/50">Chat</p>
        </div>

      </div>
    </div>

  )
}

export default Controls
