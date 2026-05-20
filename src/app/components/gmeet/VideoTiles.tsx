import React, { useEffect } from 'react';
import { AccountCircle } from '@mui/icons-material';
import PeopleSidebar from './Sidebar';

interface VideoTilesProps {
    isSpeaking: Boolean;
    setIsSpeaking: Function;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

const VideoTiles: React.FC<VideoTilesProps> = ({
    isSpeaking,
    setIsSpeaking,
    sidebarOpen,
    toggleSidebar
}) => {
    useEffect(() => {
        let audioContext: AudioContext;
        let analyser: AnalyserNode;
        let dataArray: Uint8Array;
        let animationId: number;

        const initAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContext = new AudioContext();
                analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);

                analyser.fftSize = 256;
                dataArray = new Uint8Array(analyser.frequencyBinCount);

                const checkAudio = () => {
                    analyser.getByteFrequencyData(dataArray);
                    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                    setIsSpeaking(average > 35);
                    animationId = requestAnimationFrame(checkAudio);
                };

                checkAudio();
            } catch (error) {
                console.error('Error accessing microphone:', error);
            }
        };

        initAudio();

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            if (audioContext) audioContext.close();
        };
    }, [setIsSpeaking]);

    return (
        <div className="relative h-screen bg-[#202124] p-4 pb-24 flex">
            {/* Main video area */}
            <div className={`relative h-full ${sidebarOpen ? 'w-3/4' : 'w-full'} 
                transition-all duration-300 ease-in-out rounded-xl overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 to-green-900/30" />

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {isSpeaking && (
                        <div className="absolute inset-[-20px] z-0">
                            <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full animate-[ripple_1.5s_linear_infinite]" />
                            <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full animate-[ripple_1.5s_linear_0.5s_infinite]" />
                            <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full animate-[ripple_1.5s_linear_1s_infinite]" />
                        </div>
                    )}
                    <div className="relative bg-yellow-400 rounded-full p-4 z-10">
                        <AccountCircle className="w-12 h-12 text-white" />
                    </div>
                </div>

                <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1 rounded-lg font-bold">
                        <span className="text-white text-sm">Mohit Arora</span>
                    </div>
                </div>
            </div>

            {/* Sidebar integrated directly in VideoTiles */}
            <div className={`h-full bg-white overflow-hidden transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'w-1/4 opacity-100' : 'w-0 opacity-0'}`}>
                {sidebarOpen && (
                    <div className="h-full">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-medium text-gray-800">People</h2>
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <span className="text-gray-600">✕</span>
                            </button>
                        </div>

                        <div className="p-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors w-full">
                                <span>+ Add people</span>
                            </button>
                        </div>

                        <div className="p-4 border-t">
                            <h3 className="text-sm font-medium text-gray-500 mb-4">IN THIS CALL</h3>

                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                                        <span className="text-white font-medium">MA</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Mohit Arora (You)</p>
                                        <p className="text-xs text-gray-500">Meeting host</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes ripple {
                    0% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default VideoTiles;