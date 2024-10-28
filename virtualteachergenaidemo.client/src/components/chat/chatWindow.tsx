import './chatWindow.css';
import { useState, useEffect, useRef } from 'react';
import SpeechRecognizer from '../speechRecognizer/speechRecognizer';
import AudioVisualizer from '../speechRecognizer/AudioVisualizer';
import { ChatHistoryRequest, ChatMessage } from '../../models/ChatHistoryRequest';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

interface Message {
    content: string;
    role: 'User' | 'Assistant';
}

function ChatWindow() {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const currentMessageRef = useRef<string | null>(null);
    const chatId = "";
    const hubUrl = process.env.HUB_URL;

    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl!)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, [hubUrl]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to SignalR hub');

                    connection.on('ReceiveMessageUpdate', (message: any) => {
                        if (message.state === "Start") {
                            currentMessageRef.current = message.content;
                            setMessages(prevMessages => [...prevMessages, { content: message.content, role: 'Assistant' }]);
                        } else if (message.state === "InProgress") {
                            setMessages(prevMessages => {
                                const updatedMessages = [...prevMessages];
                                updatedMessages[updatedMessages.length - 1] = { content: message.content, role: 'Assistant' }
                                return updatedMessages;
                            });
                        }
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setAudioFile(event.target.files[0]);
        }
    };

    const handleNewMessage = async (message: string) => {        
        setMessages(prevMessages => [...prevMessages, { content: message, role: 'User' }]);

        const chatHistory = new ChatHistoryRequest([
            new ChatMessage("System", "test"),
            ...messages.map(msg => new ChatMessage("User", msg.content)),
            new ChatMessage("User", message)
        ]);
        await callLLMApi(chatId, chatHistory);
    };

    const callLLMApi = async (chatId: string, chatHistory: ChatHistoryRequest) => {
        try {
            const response = await fetch(`/api/chat?chatId=${chatId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chatHistory),
            });
            await response.json();
        } catch (error) {
            console.error('Error calling Chat:', error);
        }
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
                                <div key={index} className={`chat-message ${msg.role === 'User' ? 'user-message' : 'assistant-message'}`}>
                                    {msg.content}
                                </div>
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
