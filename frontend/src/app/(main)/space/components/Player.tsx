import ReactPlayer from 'react-player';
import { useEffect, useRef } from 'react';

const Player = (props: { url: string | MediaStream | null, muted: boolean, playing: boolean, className: string}) => {
    const { url, muted, playing, className} = props
    const videoRef = useRef<HTMLVideoElement>(null);
    
    useEffect(() => {
        if (videoRef.current && url instanceof MediaStream) {
            videoRef.current.srcObject = url;
        }
    }, [url]);
    
    if (!url) {
        return <div className={className}></div>;
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
    
    return(
        <div>
            <ReactPlayer controls={true} playing={playing} muted={muted} src={url as string} className={className} />
        </div>
    )
}

export default Player;
