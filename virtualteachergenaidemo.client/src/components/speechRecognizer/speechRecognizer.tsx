import { useState } from 'react';
import { Button } from '@fluentui/react-button';
import { MicRegular } from "@fluentui/react-icons";
import { getSpeechRecognizerAsync } from '../../services/SpeechService';
import './speechRecognizer.css';

interface SpeechRecognizerProps {
    onNewMessage: (message: string) => void;
    voiceName: string;
    language: string;

}

const SpeechRecognizer: React.FC<SpeechRecognizerProps> = ({ onNewMessage, voiceName, language }) => {    
    const [isMicOn, setIsMicOn] = useState(false);

    const startRecognition = async () => {
        try {
            setIsMicOn(true);
            const recognizer = await getSpeechRecognizerAsync(voiceName, language);

            recognizer.recognizeOnceAsync(result => {                
                onNewMessage(result.text);
                setIsMicOn(false);
            });
        } catch (error) {
            console.error('Error starting speech recognition:', error);
        }
    };

    return (
        <div>
            <Button onClick={startRecognition}                
                appearance="transparent"
                className={`mic-icon ${isMicOn ? 'mic-on' : ''}`}               
                icon={<MicRegular className={`mic-icon ${isMicOn ? 'mic-on' : ''}`} />}
                disabled={isMicOn}
            />           
        </div>
    );
};

export default SpeechRecognizer;