import { useState } from 'react';
import { Button } from '@fluentui/react-components';
import { MicRegular } from "@fluentui/react-icons";
import { getSpeechRecognizerAsync } from '../../services/speechService';
import './speechRecognizer.css';

const SpeechRecognizer = () => {
    const [transcript, setTranscript] = useState('');
    const [isMicOn, setIsMicOn] = useState(false);

    const startRecognition = async () => {
        try {
            setIsMicOn(true);
            const recognizer = await getSpeechRecognizerAsync();

            recognizer.recognizeOnceAsync(result => {
                setTranscript(result.text);
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
            <p>{transcript}</p>
        </div>
    );
};

export default SpeechRecognizer;