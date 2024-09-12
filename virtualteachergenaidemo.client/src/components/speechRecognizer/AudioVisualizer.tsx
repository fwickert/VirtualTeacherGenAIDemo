import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
    audioFile: File | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioFile }) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const [audioData, setAudioData] = useState<number[]>([0, 0, 0, 0, 0]);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isReflecting, setIsReflecting] = useState<boolean>(false);

    useEffect(() => {
        if (audioFile) {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            dataArrayRef.current = dataArray;

            const reader = new FileReader();
            reader.readAsArrayBuffer(audioFile);
            reader.onload = () => {
                if (reader.result) {
                    audioContext.decodeAudioData(reader.result as ArrayBuffer, (buffer) => {
                        const source = audioContext.createBufferSource();
                        source.buffer = buffer;
                        source.connect(analyser);
                        analyser.connect(audioContext.destination);
                        source.start(0);
                        setIsPlaying(true);
                        visualize();

                        // Add event listener for the 'ended' event
                        source.onended = () => {
                            setIsPlaying(false);
                            setIsReflecting(false);
                        };
                    });
                }
            };

            return () => {
                audioContext.close();
                setIsPlaying(false);
                
            };
        }
    }, [audioFile]);

    const visualize = () => {
        if (analyserRef.current && dataArrayRef.current) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            const newAudioData = [
                dataArrayRef.current[0],
                dataArrayRef.current[1],
                dataArrayRef.current[2],
                dataArrayRef.current[3],
                dataArrayRef.current[4],
            ];
            setAudioData(newAudioData);
            requestAnimationFrame(visualize);
        }
    };

    const MIN_HEIGHT = 80; // Hauteur minimale des barres

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {!isPlaying ? (
                <div
                    style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: 'black',
                        borderRadius: '50%',
                        animation: isReflecting ? 'pulse 2s infinite' : 'none',
                    }}
                />
            ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3px' }}>
                    {audioData.map((value, index) => (
                        <div
                            key={index}
                            style={{
                                width: '20px',
                                minHeight: '10px',                                
                                height: `${Math.max(value, MIN_HEIGHT)}px`,
                                backgroundColor: 'black',
                                borderRadius: '10%',
                                transition: 'height 0.3s',
                            }}
                        />
                    ))}
                </div>
            )}
            {!isPlaying && (
                <button onClick={() => setIsReflecting(!isReflecting)} style={{ marginTop: '20px' }}>
                    {isReflecting ? 'Stop' : 'Loading'}
                </button>
            )}
            <style>
                {`
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(0.5); }
                        100% { transform: scale(1); }
                    }
                `}
            </style>
        </div>
    );
};

export default AudioVisualizer;
