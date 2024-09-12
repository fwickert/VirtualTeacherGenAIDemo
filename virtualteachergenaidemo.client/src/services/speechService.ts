import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';

interface TokenResponse {
    subscriptionKey: string;
    region: string;
    defaultLanguage: string,
    voiceName:string    
}

async function getSpeechTokenAsync() {
    const response = await fetch('/api/speech/config');
    const data = await response.json();

    return data as TokenResponse;
};

export async function getSpeechRecognizerAsync() {
    const token = await getSpeechTokenAsync();
    const speechConfig = speechSdk.SpeechConfig.fromSubscription(token.subscriptionKey, token.region);
    const audioConfig = speechSdk.AudioConfig.fromDefaultMicrophoneInput();
    speechConfig.speechRecognitionLanguage = token.defaultLanguage;
    speechConfig.speechSynthesisVoiceName = token.voiceName;
    return new speechSdk.SpeechRecognizer(speechConfig, audioConfig);
}


