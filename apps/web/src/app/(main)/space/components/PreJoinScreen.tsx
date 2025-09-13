import React, { useEffect, useRef, useState } from 'react';
import { RiMicLine, RiMicOffLine } from 'react-icons/ri';
import { FiVideo, FiVideoOff } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import Player from './Player';
import Header from './Header';
import playClickSound from '@/utils/ClickSound';
import { useQualityCheck, useQualityCheckResult } from '@/hooks/useQualityCheck';

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
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunks = useRef<Blob[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [waitingMessage, setWaitingMessage] = useState(false);
    const [qualityCheckRequestId, setQualityCheckRequestId] = useState<string | null>(null);

    // Tanstack Query hooks
    const { sendQualityCheck, isLoading: isSubmitting, data: submissionResponse, error: submissionError } = useQualityCheck();
    const { data: qualityCheckResult, isLoading: isGettingResult, error: resultError } = useQualityCheckResult(
        qualityCheckRequestId,
        !!qualityCheckRequestId
    );

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
                    setPermissionError('Camera and microphone access denied. Please allow access and try again.');
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

    useEffect(() => {
        initializeStream();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [videoEnabled, audioEnabled]);

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

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingCountdown(5);

            const countdownInterval = setInterval(() => {
                setRecordingCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

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

        sendQualityCheck({
            videoBlob,
            roomId,
            username,
        });
    };

    // Effect to handle submission response
    useEffect(() => {
        if (submissionResponse) {
            setQualityCheckRequestId(submissionResponse.requestId);
            setIsProcessing(false);
            setWaitingMessage(true);
        }
    }, [submissionResponse]);

    // Effect to handle submission errors
    useEffect(() => {
        if (submissionError) {
            console.error('Error sending video to backend:', submissionError);
            setIsProcessing(false);
            setWaitingMessage(false);
        }
    }, [submissionError]);

    // Log quality check results for debugging
    useEffect(() => {
        if (qualityCheckResult) {
            console.log('Quality check result:', qualityCheckResult);

            if (qualityCheckResult.status === 'completed') {
                setWaitingMessage(false);
                // You can add logic here to display the results to the user
                // For example, showing recommendations or quality scores
            }
        }
    }, [qualityCheckResult]);

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
                                        onClick={initializeStream}
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
                                disabled={isLoading || !!permissionError || isRecording || isProcessing || isSubmitting || !stream}
                                className='flex-1 flex items-center justify-center text-foreground/80 gap-2 py-2.5 bg-call-primary border border-call-border rounded-lg w-full font-medium text-sm select-none cursor-pointer hover:bg-primary-hover transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'
                            >
                                {isRecording ? `Recording ${recordingCountdown}s` : (isProcessing || isSubmitting) ? 'Processing' : 'AI quality check'}
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
                        <div className={`select-none flex items-center gap-2 ${isRecording ? 'animate-pulse' : ''}`}>
                            <div className={`size-[10px] ${isRecording ? 'bg-red-500' : 'bg-green-500'} rounded-full`}></div>
                            <span className="text-foreground/50 text-xs font-medium">
                                {isRecording ? (
                                    `Recording a ${recordingCountdown} second${recordingCountdown !== 1 ? 's' : ''} clip of your video and audio.`
                                ) : (
                                    'Recorded a 5 second clip of your video and audio.'
                                )}
                            </span>
                        </div>
                        {isProcessingStarted && (
                            <div className={`select-none flex items-center gap-2 ${isProcessing ? 'animate-pulse' : ''}`}>
                                <div className={`size-[10px] ${isProcessing ? 'bg-red-500 ' : 'bg-green-500'} rounded-full`}></div>
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
                            <div className={`select-none flex items-center gap-2 ${waitingMessage ? 'animate-pulse' : ''}`}>
                                <div className={`size-[10px] ${waitingMessage ? 'bg-red-500' : 'bg-green-500'} rounded-full`}></div>
                                <span className="text-foreground/50 text-xs font-medium">
                                    {waitingMessage ? (
                                        'Waiting for AI to check your video and audio quality.'
                                    ) : (
                                        'AI checked your video and audio quality.'
                                    )}
                                </span>
                            </div>
                        )}

                        {/* Quality Check Results */}
                        {qualityCheckResult && qualityCheckResult.status === 'completed' && (
                            <div className="mt-4 space-y-3">
                                <div className="w-full h-[1px] bg-call-border" />
                                <h3 className="text-sm font-medium text-center">Quality Check Results</h3>

                                {/* Video Quality */}
                                {qualityCheckResult.videoQuality && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-foreground/70">Video Quality:</span>
                                            <span className={`text-xs px-2 py-1 rounded ${qualityCheckResult.videoQuality.overall === 'good'
                                                ? 'bg-green-500/20 text-green-400'
                                                : qualityCheckResult.videoQuality.overall === 'fair'
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {qualityCheckResult.videoQuality.overall.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-foreground/50">Brightness:</span>
                                                <span className="text-foreground/70">{qualityCheckResult.videoQuality.details.brightness}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-foreground/50">Clarity:</span>
                                                <span className="text-foreground/70">{qualityCheckResult.videoQuality.details.clarity}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Audio Quality */}
                                {qualityCheckResult.audioQuality && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-foreground/70">Audio Quality:</span>
                                            <span className={`text-xs px-2 py-1 rounded ${qualityCheckResult.audioQuality.overall === 'good'
                                                ? 'bg-green-500/20 text-green-400'
                                                : qualityCheckResult.audioQuality.overall === 'fair'
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {qualityCheckResult.audioQuality.overall.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-foreground/50">Clarity:</span>
                                                <span className="text-foreground/70">{qualityCheckResult.audioQuality.details.clarity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-foreground/50">Volume:</span>
                                                <span className="text-foreground/70">{qualityCheckResult.audioQuality.details.volume}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {qualityCheckResult.recommendations && qualityCheckResult.recommendations.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="w-full h-[1px] bg-call-border" />
                                        <h4 className="text-xs font-medium text-foreground/70">Recommendations:</h4>
                                        <ul className="text-xs text-foreground/50 space-y-1">
                                            {qualityCheckResult.recommendations.slice(0, 3).map((rec, index) => (
                                                <li key={index} className="flex items-start gap-1">
                                                    <span className="text-purple-400 mt-1">•</span>
                                                    <span>{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error Display */}
                        {(submissionError || resultError) && (
                            <div className="mt-4 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
                                {submissionError?.message || resultError?.message || 'An error occurred during quality check.'}
                            </div>
                        )}
                    </div>


                </div>)}
        </div>
    );
};

export default PreJoinScreen; 