import { useEffect, useRef } from 'react';
import { RiMicOffLine } from 'react-icons/ri';

interface PlayerProps {
    url: string | MediaStream | null;
    muted: boolean;
    playing: boolean;
    className: string;
    myVideo?: boolean;
}

const Player = ({ url, muted, playing, className, myVideo }: PlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && url instanceof MediaStream) {
            videoRef.current.srcObject = url;
        }
    }, [url]);

    useEffect(() => {
        if (videoRef.current) {
            if (playing) {
                videoRef.current.play().catch(console.error);
            } else {
                videoRef.current.pause();
            }
        }
    }, [playing]);

    if (!url) {
        return null;
    }

    // Base styles to prevent layout issues and ensure proper sizing
    const baseVideoStyles = "max-w-full max-h-full min-w-0 min-h-0 object-contain";
    const mirrorStyle = myVideo ? "scale-x-[-1]" : "";

    const videoElement = (
        <video
            ref={videoRef}
            autoPlay={url instanceof MediaStream}
            controls={!(url instanceof MediaStream)}
            playsInline
            muted={muted}
            src={url instanceof MediaStream ? undefined : url}
            className={`${baseVideoStyles} ${className} ${mirrorStyle}`}
        />
    );

    return (
        <div className="relative w-full h-full">
            {videoElement}
            {muted && (
                <div className="absolute top-3 right-3 bg-black/40 p-2 rounded-full">
                    <RiMicOffLine size={20} className="text-white" />
                </div>
            )}
        </div>
    );
};

export default Player;
