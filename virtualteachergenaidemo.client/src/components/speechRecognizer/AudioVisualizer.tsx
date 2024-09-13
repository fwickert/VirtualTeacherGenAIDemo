import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
    audioFile?: File | null;
    useMicrophone?: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioFile, useMicrophone = false }) => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const [audioData, setAudioData] = useState<number[]>([0, 0, 0, 0]);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const startAudio = async () => {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            dataArrayRef.current = dataArray;

            if (useMicrophone) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const source = audioContext.createMediaStreamSource(stream);
                    source.connect(analyser);
                    setIsPlaying(true);
                    visualize();
                } catch (err) {
                    console.error('Error accessing microphone:', err);
                }
            } else if (audioFile) {
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
                                setIsLoading(false);
                            };
                        });
                    }
                };
            }

            return () => {
                audioContext.close();
                setIsPlaying(false);
            };
        };

        startAudio();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [audioFile, useMicrophone]);

    const visualize = () => {
        if (analyserRef.current && dataArrayRef.current) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            const newAudioData = [
                dataArrayRef.current[0],
                dataArrayRef.current[1],
                dataArrayRef.current[2],
                dataArrayRef.current[3],
            ];
            setAudioData(newAudioData);
            requestAnimationFrame(visualize);
        }
    };

    const MIN_HEIGHT = 20; // Minimum height of the bars

    const animationDurations = ['2s', '2s', '2s', '2s'];
    const animationDelays = ['0s', '0.5s', '1s', '1.5s'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3px' }}>
                {!isPlaying && !isLoading && (
                    <div
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            animation: 'none',
                        }}
                    />
                )}
                {isLoading && !isPlaying && (
                    <>
                        {audioData.map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: 'black',
                                    borderRadius: '50%',
                                    animation: `breathing ${animationDurations[index]} ${animationDelays[index]} infinite`,
                                }}
                            />
                        ))}
                    </>
                )}
                {isPlaying && (
                    <>
                        {audioData.map((value, index) => (
                            <div
                                key={index}
                                style={{
                                    width: '20px',
                                    height: `${Math.max(value-150, MIN_HEIGHT)}px`,
                                    backgroundColor: 'black',
                                    borderRadius: '50%',
                                    transition: 'height 0.3s, border-radius 0.3s',
                                }}
                            />
                        ))}
                    </>
                )}
            </div>
            {!isPlaying && (
                <button onClick={() => setIsLoading(!isLoading)} style={{ marginTop: '20px' }}>
                    {isLoading ? 'Stop' : 'Loading'}
                </button>
            )}
            <style>
                {`
                    @keyframes breathing {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); }
                    }
                `}
            </style>
        </div>
    );
};

export default AudioVisualizer;
