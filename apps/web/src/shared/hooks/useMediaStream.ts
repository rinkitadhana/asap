import { useEffect, useRef, useState } from "react";

interface MediaStreamSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
}

const useMediaStream = (initialSettings?: MediaStreamSettings) => {
  const [state, setState] = useState<MediaStream | null>(null);
  const isStreamSet = useRef(false);

  useEffect(() => {
    if (isStreamSet.current) return;
    isStreamSet.current = true;
    (async function initStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        // Apply initial settings if provided
        if (initialSettings) {
          const videoTracks = stream.getVideoTracks();
          const audioTracks = stream.getAudioTracks();

          videoTracks.forEach((track: MediaStreamTrack) => {
            track.enabled = initialSettings.videoEnabled;
          });

          audioTracks.forEach((track: MediaStreamTrack) => {
            track.enabled = initialSettings.audioEnabled;
          });
        }

        console.log("setting your stream with settings:", initialSettings);
        setState(stream);
      } catch (error) {
        console.error("Error setting your stream", error);
      }
    })();
  }, [initialSettings]);

  return { stream: state };
};

export default useMediaStream;
