import { useEffect, useRef } from "react";
import Image from "next/image";
import StatusIndicators from "./ui/StatusIndicators";
import UserAvatar from "./ui/UserAvatar";
import { UserMediaProps } from "../types";

const UserMedia = ({
  url,
  muted,
  playing,
  className,
  myVideo,
  name,
  avatar,
  preJoin = false,
  speakerMuted = false,
  hideElements = false,
}: UserMediaProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && url instanceof MediaStream) {
      // For MediaStream, always keep the video element playing
      // The actual video/audio control is handled via track.enabled
      if (videoRef.current.srcObject !== url) {
        videoRef.current.srcObject = url;
      }

      const playVideo = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));
          await videoRef.current?.play();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      };
      playVideo();
    } else if (videoRef.current && typeof url === "string") {
      // For string URLs (recorded videos), handle play/pause normally
      if (playing) {
        const playVideo = async () => {
          try {
            await new Promise((resolve) => setTimeout(resolve, 100));
            await videoRef.current?.play();
          } catch (error) {
            console.error("Error playing video:", error);
          }
        };
        playVideo();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing, url]);

  // Handle speaker muting - control volume of incoming audio
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = speakerMuted ? 0 : 1;
    }
  }, [speakerMuted]);

  if (!url) {
    return null;
  }

  // Base styles to prevent layout issues and ensure proper sizing
  const baseVideoStyles =
    "max-w-full max-h-full min-w-0 min-h-0 object-contain";
  const mirrorStyle = myVideo ? "scale-x-[-1]" : "";

  const videoElement = (
    <video
      ref={videoRef}
      autoPlay
      controls={false}
      playsInline
      muted={myVideo ? true : muted}
      src={url instanceof MediaStream ? undefined : url}
      className={`${baseVideoStyles} ${className} ${mirrorStyle}`}
    />
  );

  return (
    <div className="relative w-full h-full">
      {url instanceof MediaStream ? (
        <>
          {/* Always render video element for MediaStream to maintain audio */}
          <video
            ref={videoRef}
            autoPlay
            controls={false}
            playsInline
            muted={myVideo ? true : muted}
            className={
              playing
                ? `${baseVideoStyles} ${className} ${mirrorStyle}`
                : "hidden"
            }
          />
          {/* Show fallback UI when video is off */}
          {!playing && (
            <div className="select-none w-full h-full relative flex items-center justify-center overflow-hidden">
              {/* Blurred background */}
              {avatar ? (
                <>
                  <div className="absolute inset-0 w-full h-full z-0">
                    <Image
                      src={avatar}
                      alt="background"
                      fill
                      className="object-cover blur-3xl scale-110"
                    />
                  </div>
                  {/* Dark overlay for better contrast */}
                  <div className="absolute inset-0 bg-black/50 z-[1]" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-call-primary/50 to-blue-500/30 z-0" />
              )}
              
              {/* Avatar on top */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <UserAvatar
                  name={name}
                  avatar={avatar || ""}
                  preJoin={preJoin}
                />
              </div>
            </div>
          )}
        </>
      ) : playing ? (
        // For non-MediaStream URLs (like recorded videos)
        videoElement
      ) : (
        <div className="select-none w-full h-full relative flex items-center justify-center overflow-hidden">
          {/* Blurred background */}
          {avatar ? (
            <>
              <div className="absolute inset-0 w-full h-full z-0">
                <Image
                  src={avatar}
                  alt="background"
                  fill
                  className="object-cover blur-3xl scale-110"
                />
              </div>
              {/* Dark overlay for better contrast */}
              <div className="absolute inset-0 bg-black/50 z-[1]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-call-primary/50 to-blue-500/30 z-0" />
          )}
          
          {/* Avatar on top */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <UserAvatar
              name={name}
              avatar={avatar || ""} 
              preJoin={preJoin}
            />
          </div>
        </div>
      )}
      {!hideElements && (
        <StatusIndicators muted={muted} speakerMuted={speakerMuted} />
      )}
      {!hideElements && name && (
        <div className="select-none absolute bottom-3 left-3 bg-call-primary/50 px-3 py-1 rounded-full text-foreground text-sm font-medium">
          {name}
        </div>
      )}
    </div>
  );
};

export default UserMedia;
