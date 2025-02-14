import * as speechSdk from 'microsoft-cognitiveservices-speech-sdk';

interface TokenResponse {
    subscriptionKey: string;
    region: string;
    defaultLanguage: string,
    voiceName:string,    
}

async function getSpeechTokenAsync() {
    const response = await fetch('/api/speech/config');
    const data = await response.json();

    return data as TokenResponse;
};

export async function getSpeechRecognizerAsync(voiceName: string, language: string) {
    const token = await getSpeechTokenAsync();
    const speechConfig = speechSdk.SpeechConfig.fromSubscription(token.subscriptionKey, token.region);
    const audioConfig = speechSdk.AudioConfig.fromDefaultMicrophoneInput();
    //speechConfig.speechRecognitionLanguage = token.defaultLanguage;
    //speechConfig.speechSynthesisVoiceName = token.voiceName;
    speechConfig.speechRecognitionLanguage = language;
    speechConfig.speechSynthesisVoiceName = voiceName;
    return new speechSdk.SpeechRecognizer(speechConfig, audioConfig);
}

let synthesizer: speechSdk.SpeechSynthesizer | null = null;
let player: speechSdk.SpeakerAudioDestination | null = null;

export async function textToSpeechAsync(text: string, voiceName:string) {
    const token = await getSpeechTokenAsync();
    const speechConfig = speechSdk.SpeechConfig.fromSubscription(token.subscriptionKey, token.region);
    speechConfig.speechSynthesisVoiceName = voiceName;
    

    player = new speechSdk.SpeakerAudioDestination();
    const audioConfig = speechSdk.AudioConfig.fromSpeakerOutput(player);
    synthesizer = new speechSdk.SpeechSynthesizer(speechConfig, audioConfig);


    // Split the text into sentences
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    let firstPart = sentences[0];
    let remainingText = sentences.slice(1).join(' ');

    // Check if the first sentence is too short
    if (firstPart.length < 10 && sentences.length > 1) {
        firstPart = sentences.slice(0, 2).join(' ');
        remainingText = sentences.slice(2).join(' ');
    }

    console.log('First part:', firstPart);
    console.log('Remaining text:', remainingText);

    return new Promise<void>((resolve, reject) => {
        const speakText = (textToSpeak: string) => {
            return new Promise<void>((resolve, reject) => {
                synthesizer!.speakTextAsync(
                    textToSpeak,
                    result => {
                        if (result.reason === speechSdk.ResultReason.SynthesizingAudioCompleted) {
                            console.log('Speech synthesis succeeded');
                            resolve();
                        } else {
                            reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
                        }
                    },
                    error => {
                        reject(error);
                    }
                );
            });
        };

        synthesizer!.synthesisCompleted = () => {
            console.log('Synthesis completed');
            if (remainingText.length > 0) {
                speakText(remainingText)
                    .then(() => {
                        synthesizer!.close();
                        resolve();
                    })
                    .catch(error => {
                        synthesizer!.close();
                        reject(error);
                    });
            } else {
                synthesizer!.close();
                resolve();
            }
        };

        // Speak the first part
        speakText(firstPart).catch(error => {
            synthesizer!.close();
            reject(error);
        });
    });
}

export function cancelSpeech() {
    player?.pause();
    player?.close();
}





