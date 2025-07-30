import { useEffect, useRef } from 'react';

interface PlayerProps {
    url: string | MediaStream | null;
    muted: boolean;
    playing: boolean;
    className: string;
}

const Player = ({ url, muted, playing, className }: PlayerProps) => {
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

    if (url instanceof MediaStream) {
        return (
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                className={`${baseVideoStyles} ${className}`}
            />
        );
    }

    return (
        <video
            ref={videoRef}
            controls
            muted={muted}
            src={url}
            className={`${baseVideoStyles} ${className}`}
            playsInline
        />
    );
};

export default Player;
