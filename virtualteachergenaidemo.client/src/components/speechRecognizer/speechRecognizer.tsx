import { useState } from 'react';
import { Button } from '@fluentui/react-button';
import { MicRegular } from "@fluentui/react-icons";
import { getSpeechRecognizerAsync } from '../../services/speechService';
import './speechRecognizer.css';

interface SpeechRecognizerProps {
    onNewMessage: (message: string) => void;
}

const SpeechRecognizer: React.FC<SpeechRecognizerProps> = ({ onNewMessage }) => {    
    const [isMicOn, setIsMicOn] = useState(false);

    const startRecognition = async () => {
        try {
            setIsMicOn(true);
            const recognizer = await getSpeechRecognizerAsync();

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