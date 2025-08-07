import React, { useEffect, useRef, useState } from 'react';
import { RiMicLine, RiMicOffLine } from 'react-icons/ri';
import { FiVideo, FiVideoOff } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import Player from './Player';
import Header from './Header';

interface PreJoinSettings {
    videoEnabled: boolean;
    audioEnabled: boolean;
    username: string;
}

interface PreJoinScreenProps {
    onJoinCall: (settings: PreJoinSettings) => void;
    roomId: string;
}

const PreJoinScreen = ({ onJoinCall, roomId }: PreJoinScreenProps) => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingCountdown, setRecordingCountdown] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isProcessingStarted, setIsProcessingStarted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunks = useRef<Blob[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [waitingMessage, setWaitingMessage] = useState(false);

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
            audioEnabled,
            username
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

    const startRecording = async () => {
        if (!stream) {
            console.error('No stream available for recording');
            return;
        }

        try {
            setIsProcessingStarted(false);
            setWaitingMessage(false);
            setSidebarOpen(true);
            recordedChunks.current = [];

            // Create MediaRecorder with the current stream
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8,opus'
            });

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                sendVideoToBackend(blob);
            };

            // Start recording
            mediaRecorder.start();
            setIsRecording(true);
            setRecordingCountdown(5);

            // Countdown timer
            const countdownInterval = setInterval(() => {
                setRecordingCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Stop recording after 5 seconds
            setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop();
                    setIsRecording(false);
                    setRecordingCountdown(0);
                }
            }, 5000);

        } catch (error) {
            console.error('Error starting recording:', error);
            setIsRecording(false);
            setRecordingCountdown(0);
        }
    };

    const sendVideoToBackend = async (videoBlob: Blob) => {
        setIsProcessing(true);
        setIsProcessingStarted(true);
        try {
            const formData = new FormData();
            formData.append('video', videoBlob, `quality-check-${Date.now()}.webm`);
            formData.append('roomId', roomId);
            formData.append('username', username);

            const response = await fetch('/api/quality-check', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Video sent successfully:', result);

            // You can handle the response here, e.g., show success message
            // or display the quality check results

        } catch (error) {
            console.error('Error sending video to backend:', error);
            // You can show an error message to the user here
        } finally {
            setIsProcessing(false);
            setWaitingMessage(true);
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
                                    className="w-full h-full object-cover"
                                    myVideo={true}
                                    username={username}
                                    hideElements={true}
                                />
                            )}

                            {/* Recording indicator */}
                            {isRecording && (
                                <div className="select-none absolute top-3 right-3 bg-call-primary/50 py-1.5 px-3 rounded-full flex items-center gap-1.5">
                                    <div className="size-[10px] bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-white text-xs font-medium">
                                        Recording
                                    </span>
                                </div>
                            )}

                            {/* Processing indicator */}
                            {isProcessing && (
                                <div className="select-none absolute top-3 right-3 bg-call-primary/50 py-1.5 px-3 rounded-full flex items-center gap-1.5">
                                    <Loader2 className="animate-spin text-white" size={14} />
                                    <span className="text-white text-xs font-medium">Processing</span>
                                </div>
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

                        <div className='flex flex-col gap-1.5 mb-2'>
                            <p className='text-xs text-secondary-text font-medium'>You are about to join Rinkit Adhana's space</p>
                            <h1 className='text-xl font-semibold'>Let's check you cam and mic</h1>
                        </div>
                        <div className='flex w-full gap-2 items-center'>
                            <button
                                onClick={startRecording}
                                disabled={isLoading || !!permissionError || isRecording || isProcessing || !stream}
                                className='flex-1 flex items-center justify-center text-foreground/80 gap-2 py-2.5 bg-call-primary border border-call-border rounded-lg w-full font-medium text-sm select-none cursor-pointer hover:bg-primary-hover transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'
                            >
                                {isRecording ? `Recording ${recordingCountdown}s` : isProcessing ? 'Processing' : 'AI quality check'}
                            </button>
                            <div className='flex-1 flex items-center justify-center text-foreground/80 gap-2 py-2.5 bg-call-primary border border-call-border rounded-lg w-full font-medium text-sm select-none cursor-not-allowed transition-all duration-200'>sample</div>
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2.5 bg-call-primary border border-call-border rounded-lg text-sm focus:outline-none transition-all duration-200"
                            />
                        </div>
                        <button
                            onClick={handleJoinCall}
                            disabled={isLoading || !!permissionError || !username.trim()}
                            className="py-2.5 w-full select-none text-center bg-purple-400/80 hover:bg-purple-400/60 font-medium disabled:bg-purple-400/40 disabled:text-foreground/40 disabled:cursor-not-allowed text-sm rounded-lg cursor-pointer transition-all duration-200"
                        >
                            <span>Join Call</span>
                        </button>

                    </div>
                </div>
            </div>
            {sidebarOpen && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 border border-call-border rounded-xl p-4 h-[500px] w-[400px] bg-call-primary">
                    <h1 className='font-medium  text-center'>AI Quality Check</h1>
                    <div className="w-full h-[1px] bg-call-border my-4" />
                    <div className='flex flex-col gap-2'>
                        <div className="select-none flex items-center gap-2">
                            <div className={`size-[10px] ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'} rounded-full`}></div>
                            <span className="text-foreground/50 text-xs font-medium">
                                {isRecording ? (
                                    `Recording a ${recordingCountdown} second${recordingCountdown !== 1 ? 's' : ''} clip of your video and audio.`
                                ) : (
                                    'Recorded a 5 second clip of your video and audio.'
                                )}
                            </span>
                        </div>
                        {isProcessingStarted && (
                            <div className="select-none flex items-center gap-2">
                                <div className={`size-[10px] ${isProcessing ? 'bg-red-500 animate-pulse' : 'bg-green-500'} rounded-full`}></div>
                                <span className="text-foreground/50 text-xs font-medium">
                                    {isProcessing ? (
                                        `Sending your video and audio to AI for quality check.`
                                    ) : (
                                        'Sent your video and audio to AI for quality check.'
                                    )}
                                </span>
                            </div>
                        )}
                        {waitingMessage && (
                            <div className="select-none flex items-center gap-2">
                                <div className={`size-[10px] ${waitingMessage ? 'bg-red-500 animate-pulse' : 'bg-green-500'} rounded-full`}></div>
                                <span className="text-foreground/50 text-xs font-medium">
                                    {waitingMessage ? (
                                        'Waiting for AI to check your video and audio quality.'
                                    ) : (
                                        'AI checked your video and audio quality.'
                                    )}
                                </span>
                            </div>
                        )}
                    </div>


                </div>)}
        </div>
    );
};

export default PreJoinScreen; 