import './chatWindow.css';
import { useState } from 'react';
import SpeechRecognizer from '../speechRecognizer/speechRecognizer';
import AudioVisualizer from '../speechRecognizer/AudioVisualizer';


function ChatWindow() {
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setAudioFile(event.target.files[0]);
        }
    };

    return (
        <div className='container'>
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <div className="audio-visualizer">
                <AudioVisualizer audioFile={audioFile} />
            </div>
            <div className="chat-window">
                <div className="chat-header">Chat
                    <SpeechRecognizer />
                </div>
                
                <div className="chat-messages">
                </div>
                <div className="chat-input">
                </div>
            </div>
        </div>
    )



};

export default ChatWindow;