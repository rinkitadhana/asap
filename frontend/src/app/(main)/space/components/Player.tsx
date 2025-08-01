import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { RiMicOffLine } from 'react-icons/ri';

interface PlayerProps {
    url: string | MediaStream | null;
    muted: boolean;
    playing: boolean;
    className: string;
    myVideo?: boolean;
    username?: string;
    userProfile?: string;
}

const Player = ({ url, muted, playing, className, myVideo, username, userProfile }: PlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && url instanceof MediaStream) {
            videoRef.current.srcObject = url;
        }
    }, [url]);

    useEffect(() => {
        if (videoRef.current) {
            if (playing) {
                // Ensure MediaStream is set before playing
                if (url instanceof MediaStream && videoRef.current.srcObject !== url) {
                    videoRef.current.srcObject = url;
                }

                // Ensure video plays when playing state changes to true
                const playVideo = async () => {
                    try {
                        // Wait a bit to ensure srcObject is properly set
                        await new Promise(resolve => setTimeout(resolve, 100));
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

    if (!url) {
        return null;
    }

    // Base styles to prevent layout issues and ensure proper sizing
    const baseVideoStyles = "max-w-full max-h-full min-w-0 min-h-0 object-contain";
    const mirrorStyle = myVideo ? "scale-x-[-1]" : "";

    const videoElement =
        <video
            ref={videoRef}
            autoPlay
            controls={false}
            playsInline
            muted={muted}
            src={url instanceof MediaStream ? undefined : url}
            className={`${baseVideoStyles} ${className} ${mirrorStyle}`}
        />


    return (
        <div className="relative w-full h-full">
            {playing ? videoElement :
                (
                    <div className="select-none w-full h-full bg-call-primary/50 flex items-center justify-center">
                        <div className="text-foreground text-sm font-medium">
                            {userProfile ? <Image src={userProfile} alt="User Profile" width={100} height={100} className="rounded-full" /> :
                                <div className="select-none rounded-full bg-green-400/20 flex items-center justify-center">
                                    <div className='size-[100px] flex items-center justify-center'>
                                        {username ? (
                                            <span className="text-foreground text-4xl font-medium">
                                                {username.charAt(0).toUpperCase()}
                                            </span>
                                        ) : (
                                            <span className="text-foreground text-4xl font-medium">
                                                ?
                                            </span>
                                        )}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                )}
            {muted && (
                <div className="absolute top-3 right-3 bg-call-primary/50 p-2 rounded-full">
                    <RiMicOffLine size={19} className="text-foreground" />
                </div>
            )}
            {username && (
                <div className="select-none absolute bottom-3 left-3 bg-call-primary/50 px-3 py-1 rounded-full text-foreground text-sm font-medium">
                    {username}
                </div>
            )}
        </div>
    );
};

export default Player;
