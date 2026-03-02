import React, { useState, useEffect } from 'react';
import { TolyaImage } from './GameAssets';
import { ChevronRight, MessageSquare } from 'lucide-react';

export interface VNChoice {
    text: string;
    nextNodeId: string;
    effect?: () => void;
}

export interface VNNode {
    id: string;
    speaker: string;
    text: string;
    backgroundImage?: string;
    videoBackground?: string; // New field for video support
    characterSprite?: string;
    choices: VNChoice[];
}

interface VisualNovelSceneProps {
    story: VNNode[];
    startNodeId: string;
    onEnd: (outcome: string) => void;
}

export const VisualNovelScene: React.FC<VisualNovelSceneProps> = ({ story, startNodeId, onEnd }) => {
    const [currentNodeId, setCurrentNodeId] = useState(startNodeId);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const currentNode = story.find((node: VNNode) => node.id === currentNodeId) || story[0];

    useEffect(() => {
        setDisplayedText('');
        setIsTyping(true);
        let i = 0;
        const fullText = currentNode.text;

        const timer = setInterval(() => {
            if (i < fullText.length) {
                setDisplayedText((prev: string) => prev + fullText.charAt(i));
                i++;
            } else {
                setIsTyping(false);
                clearInterval(timer);
            }
        }, 30);

        return () => clearInterval(timer);
    }, [currentNodeId]);

    const handleChoice = (choice: VNChoice) => {
        if (isTyping) {
            setDisplayedText(currentNode.text);
            setIsTyping(false);
            return;
        }

        if (choice.effect) choice.effect();

        if (choice.nextNodeId === 'WIN' || choice.nextNodeId === 'LOST') {
            onEnd(choice.nextNodeId);
        } else {
            setCurrentNodeId(choice.nextNodeId);
        }
    };

    return (
        <div className="absolute inset-0 bg-black flex flex-col justify-end p-4 overflow-hidden select-none">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {currentNode.videoBackground ? (
                    <video
                        key={currentNode.videoBackground}
                        src={currentNode.videoBackground}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                        style={{ filter: 'blur(2px)' }}
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-1000"
                        style={{
                            backgroundImage: currentNode.backgroundImage ? `url(${currentNode.backgroundImage})` : 'url("./assets/lvl2.png")',
                            filter: 'blur(2px)'
                        }}
                    />
                )}
            </div>

            {/* Character Sprite Layer */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-1">
                <div className="w-64 h-64 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {currentNode.speaker === 'Толя' ? (
                        <TolyaImage isJumping={false} direction="right" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-32 h-32 bg-indigo-500/50 rounded-full blur-2xl animate-pulse" />
                        </div>
                    )}
                </div>
            </div>

            {/* Dialogue Box Area */}
            <div className="relative z-10 w-full max-w-3xl mx-auto mb-4 scale-90 sm:scale-100">
                {/* Speaker Name Tag */}
                <div className="inline-block px-4 py-1 bg-indigo-600 text-white font-bold rounded-t-lg border-x-2 border-t-2 border-indigo-400 ml-4 shadow-lg">
                    {currentNode.speaker}
                </div>

                {/* Main Dialogue Box */}
                <div
                    className="bg-slate-900/80 backdrop-blur-md border-2 border-indigo-500 rounded-2xl p-6 min-h-[120px] shadow-2xl relative cursor-pointer"
                    onClick={() => isTyping && setDisplayedText(currentNode.text)}
                >
                    <p className="text-indigo-50 text-xl font-medium leading-relaxed">
                        {displayedText}
                        {isTyping && <span className="inline-block w-2 h-5 bg-indigo-400 ml-1 animate-pulse" />}
                    </p>

                    {!isTyping && (
                        <div className="absolute bottom-2 right-4 text-indigo-400 animate-bounce">
                            <ChevronRight size={24} />
                        </div>
                    )}
                </div>

                {/* Choices */}
                {!isTyping && (
                    <div className="mt-4 grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {currentNode.choices.map((choice: VNChoice, idx: number) => (
                            <button
                                key={idx}
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    handleChoice(choice);
                                }}
                                className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/20 hover:border-indigo-400 p-4 rounded-xl text-white text-left transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-500/50 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                    <MessageSquare size={16} />
                                </div>
                                <span className="flex-1 font-bold text-lg">{choice.text}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
