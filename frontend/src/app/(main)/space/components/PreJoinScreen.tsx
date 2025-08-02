import React, { useEffect, useRef, useState } from 'react';
import { RiMicLine, RiMicOffLine } from 'react-icons/ri';
import { FiVideo, FiVideoOff } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Player from './Player';
import Header from './Header';

interface PreJoinSettings {
    videoEnabled: boolean;
    audioEnabled: boolean;
}

interface PreJoinScreenProps {
    onJoinCall: (settings: PreJoinSettings) => void;
    roomId: string;
}

const PreJoinScreen = ({ onJoinCall, roomId }: PreJoinScreenProps) => {
    const router = useRouter();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Initialize media stream for preview
    useEffect(() => {
        const initializeStream = async () => {
            try {
                setIsLoading(true);
                setPermissionError(null);

                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                streamRef.current = mediaStream;
                setStream(mediaStream);

                // Apply initial preferences to tracks
                const videoTracks = mediaStream.getVideoTracks();
                const audioTracks = mediaStream.getAudioTracks();

                videoTracks.forEach(track => {
                    track.enabled = videoEnabled;
                });

                audioTracks.forEach(track => {
                    track.enabled = audioEnabled;
                });

            } catch (error) {
                console.error('Error accessing media devices:', error);
                if (error instanceof Error) {
                    if (error.name === 'NotAllowedError') {
                        setPermissionError('Camera and microphone access denied. Please allow access and refresh the page.');
                    } else if (error.name === 'NotFoundError') {
                        setPermissionError('No camera or microphone found. Please check your devices.');
                    } else {
                        setPermissionError('Unable to access camera and microphone. Please check your devices and permissions.');
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        initializeStream();

        // Cleanup function
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [videoEnabled, audioEnabled]);

    // Update stream tracks when preferences change
    useEffect(() => {
        if (!stream) return;

        const videoTracks = stream.getVideoTracks();
        const audioTracks = stream.getAudioTracks();

        videoTracks.forEach(track => {
            track.enabled = videoEnabled;
        });

        audioTracks.forEach(track => {
            track.enabled = audioEnabled;
        });
    }, [videoEnabled, audioEnabled, stream]);

    const handleVideoToggle = () => {
        setVideoEnabled(prev => !prev);
    };

    const handleAudioToggle = () => {
        setAudioEnabled(prev => !prev);
    };

    const handleJoinCall = () => {
        onJoinCall({
            videoEnabled,
            audioEnabled
        });
    };

    const playClickSound = () => {
        try {
            const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

            fetch('/audio/click.mp3')
                .then(response => response.arrayBuffer())
                .then(data => audioContext.decodeAudioData(data))
                .then(audioBuffer => {
                    const source = audioContext.createBufferSource();
                    const gainNode = audioContext.createGain();

                    source.buffer = audioBuffer;
                    gainNode.gain.value = 0.6;

                    source.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    source.start(0);

                    source.onended = () => {
                        audioContext.close();
                    };
                })
                .catch((error) => {
                    console.error("Error playing click sound:", error);
                });
        } catch {
            const audio = new Audio('/audio/click.mp3');
            audio.volume = 0.3;
            audio.play().catch(err => console.error("Audio fallback error:", err));
        }
    };

    return (
        <div className="relative bg-call-background h-screen flex flex-col p-2">
            <Header prejoin={true} />
            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center max-w-[800px] mx-auto">
                <div className="flex w-full flex-row items-center gap-10 justify-center">
                    <div className="relative">
                        <div className="w-[450px] h-[250px] bg-call-primary border border-call-border rounded-xl overflow-hidden">
                            {isLoading ? (
                                <div className="w-full h-full flex items-center justify-center bg-call-primary">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="animate-spin text-foreground" size={30} />
                                    </div>
                                </div>
                            ) : permissionError ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-call-primary/50 p-6">
                                    <div className="text-red-400 text-center text-sm mb-4">{permissionError}</div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-4 py-2 bg-call-background border border-call-border cursor-pointer text-foreground rounded-xl hover:bg-call-primary transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : (
                                <Player
                                    url={stream}
                                    muted={true}
                                    playing={videoEnabled}
                                    className="w-full h-full"
                                    myVideo={true}
                                    hideElements={true}
                                />
                            )}
                        </div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            <button
                                onClick={() => {
                                    handleAudioToggle();
                                    playClickSound();
                                }}
                                className="flex items-center justify-center p-3 rounded-xl bg-primary-hover/50  text-xl font-medium cursor-pointer hover:bg-primary-hover/70 transition-all duration-200"
                                disabled={isLoading || !!permissionError}
                            >
                                {audioEnabled ? <RiMicLine /> : <RiMicOffLine />}
                            </button>

                            <button
                                onClick={() => {
                                    handleVideoToggle();
                                    playClickSound();
                                }}
                                className="flex items-center justify-center p-3 rounded-xl bg-primary-hover/50  text-xl font-medium cursor-pointer hover:bg-primary-hover/70 transition-all duration-200"
                                disabled={isLoading || !!permissionError}
                            >
                                {videoEnabled ? <FiVideo /> : <FiVideoOff />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-4 w-full">

                        <div className='flex flex-col gap-1.5 mb-4'>
                            <p className='text-xs text-secondary-text font-medium'>You are about to join Rinkit Adhana's space</p>
                            <h1 className='text-xl font-semibold'>Let's check you cam and mic</h1>
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your name"
                                className="w-full px-3 py-2.5 bg-call-primary border border-call-border rounded-lg text-sm focus:outline-none transition-all duration-200"
                            />
                        </div>
                        <button
                            onClick={handleJoinCall}
                            disabled={isLoading || !!permissionError}
                            className="py-2.5 w-full select-none text-center bg-purple-400/80 hover:bg-purple-400/60 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed text-sm rounded-lg cursor-pointer transition-all duration-200"
                        >
                            <span>Join Call</span>
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreJoinScreen; 