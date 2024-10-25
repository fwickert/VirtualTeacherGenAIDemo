import './chatWindow.css';
import { useState } from 'react';
import SpeechRecognizer from '../speechRecognizer/speechRecognizer';
import AudioVisualizer from '../speechRecognizer/AudioVisualizer';

function ChatWindow() {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setAudioFile(event.target.files[0]);
        }
    };

    const handleNewMessage = (message: string) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };


    return (
        <div className="chat-container">
            <div className="grid-column">
                <div>
                    <input type="file" accept="audio/*" onChange={handleFileChange} />
                    <AudioVisualizer audioFile={audioFile} />
                </div>
            </div>
            <div className="grid-column">
                <div>
                    <div className="chat-window">
                        <div className="chat-header">
                            Chat
                            
                        </div>
                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className="chat-message">{msg}</div>
                            ))}
                        </div>
                        <div className="chat-input">
                            {/* Chat input will go here */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid-column">
                <SpeechRecognizer onNewMessage={handleNewMessage} />
            </div>
            <div className="grid-column">
                {/*<AudioVisualizer useMicrophone />*/}
            </div>
        </div>
        
    );
}

export default ChatWindow;
