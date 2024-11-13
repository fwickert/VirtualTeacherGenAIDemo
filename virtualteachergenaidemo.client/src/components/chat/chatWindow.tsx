import './chatWindow.css';
import { useState, useEffect, useRef } from 'react';
import SpeechRecognizer from '../speechRecognizer/speechRecognizer';
import AudioVisualizer from '../speechRecognizer/AudioVisualizer';
import { ChatHistoryRequest, ChatMessage } from '../../models/ChatHistoryRequest';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { textToSpeechAsync } from '../../services/speechService';
import { ScenarioItem } from '../../models/ScenarioItem';

interface Message {
    content: string;
    role: 'User' | 'Assistant';
}

interface ChatWindowProps {
    scenario: ScenarioItem;
}

function ChatWindow({ scenario }: ChatWindowProps) {
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
                        } else if (message.state === "End") {
                            textToSpeechAsync(message.content);

                        }
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const handleNewMessage = async (message: string) => {
        setMessages(prevMessages => [...prevMessages, { content: message, role: 'User' }]);

        //get the systme agent from the scenario agents
        const agent = scenario.agents.find(agent => agent.type === 'system');                
        //Same for rolePlay
        const rolePlayAgent = scenario.agents.find(agent => agent.type === 'rolePlay');
        const promptSystem = agent!.prompt + "/r/n" + rolePlayAgent!.prompt;

        const chatHistory = new ChatHistoryRequest([
            new ChatMessage("System", promptSystem),
            ...messages.map(msg => new ChatMessage(msg.role, msg.content)),
            new ChatMessage("User", message)
        ]);
        await callLLMApi(chatId, chatHistory);
    };

    const callLLMApi = async (chatId: string, chatHistory: ChatHistoryRequest) => {
        console.log(chatHistory);
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

    const handleDeleteMessage = (index: number) => {
        setMessages(prevMessages => prevMessages.filter((_, i) => i !== index));
    };

    return (
        <div className="chat-container">
            <div className="grid-column">
                {/*<input type="file" accept="audio/*" onChange={handleFileChange} />*/}
                <AudioVisualizer />
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
                                    <span className="delete-message" onClick={() => handleDeleteMessage(index)}>&times;</span>
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
            <span>{scenario.name} : {scenario.id}</span>
        </div>
    );
}

export default ChatWindow;
