import { useState } from 'react';
import { Button } from '@fluentui/react-components';
import { MicRegular } from "@fluentui/react-icons";
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const SpeechRecognizer = () => {
    const [transcript, setTranscript] = useState('');

    const startRecognition = () => {
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription('key', 'region');
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        speechConfig.speechRecognitionLanguage = 'fr-Fr';
        const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
        
        recognizer.recognizeOnceAsync(result => {
            setTranscript(result.text);
        });
    };

    return (
        <div>            
            <Button onClick={startRecognition} className="mic-icon" appearance="transparent" icon={<MicRegular />} />
            <p>{transcript}</p>
        </div>
    );
};

export default SpeechRecognizer;