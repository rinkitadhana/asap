import ReactPlayer from 'react-player';
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

    if (!url) {
        return null;
    }

    if (url instanceof MediaStream) {
        return (
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
                className={className}
            />
        );
    }

    return (
        <ReactPlayer
            controls
            playing={playing}
            muted={muted}
            src={url}
            className={className}
        />
    );
};

export default Player;
