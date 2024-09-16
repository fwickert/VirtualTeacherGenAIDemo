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
        <div className="chat-container">
            <div className="grid-column">
                <div>
                    {/*<input type="file" accept="audio/*" onChange={handleFileChange} />*/}
                    <AudioVisualizer audioFile={audioFile} />
                </div>
            </div>
            <div className="grid-column">
                <div>
                    <div className="chat-window">
                        <div className="chat-header">
                            Chat
                            <SpeechRecognizer />
                        </div>
                        <div className="chat-messages">
                            {/* Chat messages will go here */}
                        </div>
                        <div className="chat-input">
                            {/* Chat input will go here */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid-column">
                {/*<AudioVisualizer useMicrophone />*/}
            </div>
        </div>
        //<div className="grid-container">

        //    <div className="center">
        //        <div className="chat-container">
        //            <div className="chat-window">
        //                <div className="chat-header">
        //                    Chat
        //                    <SpeechRecognizer />
        //                </div>
        //                <div className="chat-messages">
        //                    {/* Chat messages will go here */}
        //                </div>
        //                <div className="chat-input">
        //                    {/* Chat input will go here */}
        //                </div>
        //            </div>
        //        </div>
        //    </div>
        //    <div className="right">
        //        <div>
        //            test
        //        </div>
        //    </div>
        //</div>
    );
}

export default ChatWindow;
