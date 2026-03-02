import React, { useRef, useEffect } from 'react';

interface VideoCutsceneProps {
    src: string;
    onEnded: () => void;
    autoPlay?: boolean;
    showSkip?: boolean;
}

export const VideoCutscene: React.FC<VideoCutsceneProps> = ({ src, onEnded, autoPlay = true, showSkip = true }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay prevented, waiting for user interaction", error);
            });
        }
    }, [autoPlay]);

    return (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                onEnded={onEnded}
                playsInline
                autoPlay={autoPlay}
            />

            {showSkip && (
                <button
                    onClick={onEnded}
                    className="absolute bottom-10 right-10 bg-black/50 hover:bg-black/80 text-white px-6 py-2 rounded-full backdrop-blur-md border border-white/20 transition-all font-bold"
                >
                    Пропустить [SKIP]
                </button>
            )}
        </div>
    );
};
