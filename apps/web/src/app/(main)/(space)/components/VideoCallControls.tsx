import {
  BsFillRecordCircleFill,
  BsFillTelephoneFill,
  BsInfoLg,
} from "react-icons/bs";
import { RiMicLine, RiMicOffLine } from "react-icons/ri";
import { FiVideo, FiVideoOff } from "react-icons/fi";
import { LuLayoutDashboard, LuScreenShare, LuUsers } from "react-icons/lu";
import { RxSpeakerLoud, RxSpeakerOff } from "react-icons/rx";
import DateComponent from "@/shared/utils/Time";
import { IoChatbubbleOutline } from "react-icons/io5";
import ControlButton from "./controls/ControlButton";
import { ControlsProps } from "../types";

const VideoCallControls = (props: ControlsProps) => {
  const {
    muted,
    playing,
    toggleAudio,
    toggleVideo,
    leaveRoom,
    speakerMuted,
    toggleSpeaker,
    toggleSidebar,
    activeSidebar,
  } = props;

  return (
    <div className="relative flex w-full justify-between items-center">
      <div>
        <DateComponent className="" />
      </div>
      <div className="select-none flex items-center gap-2.5 p-2 absolute left-1/2 -translate-x-1/2">
        <ControlButton
          icon={<BsFillRecordCircleFill className="text-base" />}
          label="Start"
          iconText="Record"
          variant="record"
        />
        <ControlButton
          icon={muted ? <RiMicOffLine /> : <RiMicLine />}
          label="Mic"
          onClick={toggleAudio}
        />
        <ControlButton
          icon={playing ? <FiVideo /> : <FiVideoOff />}
          label="Cam"
          onClick={toggleVideo}
        />
        <ControlButton
          icon={speakerMuted ? <RxSpeakerOff /> : <RxSpeakerLoud />}
          label="Speaker"
          onClick={toggleSpeaker}
        />
        <ControlButton icon={<LuScreenShare />} label="Share" />
        <div className="h-8 border-r border-primary-border mx-1 mb-4.5" />
        <ControlButton
          icon={<BsFillTelephoneFill className="-rotate-[225deg]" />}
          label="Leave"
          onClick={leaveRoom}
          variant="danger"
        />
      </div>
      <div className="flex items-center gap-2 select-none">
        <ControlButton icon={<LuLayoutDashboard />} label="Layout" />
        <ControlButton
          icon={<BsInfoLg />}
          label="Info"
          sound={false}
          onClick={() => toggleSidebar("info")}
          variant={activeSidebar === "info" ? "active" : "default"}
        />
        <ControlButton
          icon={<LuUsers />}
          label="People"
          sound={false}
          onClick={() => toggleSidebar("users")}
          variant={activeSidebar === "users" ? "active" : "default"}
        />
        <ControlButton
          icon={<IoChatbubbleOutline />}
          label="Chat"
          sound={false}
          onClick={() => toggleSidebar("chat")}
          variant={activeSidebar === "chat" ? "active" : "default"}
        />
      </div>
    </div>
  );
};

export default VideoCallControls;
