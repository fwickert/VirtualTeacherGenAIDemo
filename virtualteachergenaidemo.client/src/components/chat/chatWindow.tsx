import './chatWindow.css';
import { useState, useEffect, useRef } from 'react';
import SpeechRecognizer from '../speechRecognizer/speechRecognizer';
import AudioVisualizer from '../speechRecognizer/AudioVisualizer';
import { ChatHistoryRequest, ChatMessage } from '../../models/ChatHistoryRequest';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { textToSpeechAsync, cancelSpeech } from '../../services/speechService';
import { ScenarioItem } from '../../models/ScenarioItem';
import { SessionItem } from '../../models/SessionItem';
import { Button } from '@fluentui/react-button';

interface Message {
    content: string;
    id: string;
    chatId?: string;
    role: 'User' | 'Assistant';
}

interface ChatWindowProps {
    scenario?: ScenarioItem | undefined;
    session?: SessionItem;
}

function ChatWindow({ scenario, session }: ChatWindowProps) {
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [chatId, setChatId] = useState<string>("")
    const [sessionId, setSessionId] = useState<string>("")
    const currentMessageRef = useRef<string | null>(null);
    const [isSavingSession, setIsSavingSession] = useState<boolean>(false);

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
                            setChatId(message.chatId);
                            setMessages(prevMessages => [...prevMessages, { id: message.id, content: message.content, role: 'Assistant' }]);
                        } else if (message.state === "InProgress") {
                            setMessages(prevMessages => {
                                const updatedMessages = [...prevMessages];
                                updatedMessages[updatedMessages.length - 1] = { id: message.id, content: message.content, role: 'Assistant' }
                                return updatedMessages;
                            });
                        } else if (message.state === "End") {
                            //find message by id and update it with the id from the server
                            setMessages(prevMessages => {
                                const updatedMessages = [...prevMessages];
                                updatedMessages[updatedMessages.length - 1].id = message.id;
                                updatedMessages[updatedMessages.length - 1].chatId = message.chatId;
                                return updatedMessages;
                            });
                            textToSpeechAsync(message.content);
                        }
                    });

                    connection.on('UserIDUpdate', (message: any) => {
                        setMessages(prevMessages => {
                            const updatedMessages = [...prevMessages];
                            const lastUserMessageIndex = updatedMessages.slice().reverse().findIndex(msg => msg.role === 'User');
                            if (lastUserMessageIndex !== -1) {
                                const index = updatedMessages.length - 1 - lastUserMessageIndex;
                                updatedMessages[index] = { ...updatedMessages[index], id: message.id };
                                updatedMessages[index] = { ...updatedMessages[index], chatId: message.chatId };
                            }
                            return updatedMessages;
                        });
                    });

                    connection.on('SessionInsert', (message: any) => {
                        setSessionId(message.id);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    useEffect(() => {
        if (session) {
            fetch(`/api/chat/messages/${session.chatId}`)
                .then(response => response.json())
                .then(data => {
                    const fetchedMessages = data
                        .filter((msg: any) => msg.content !== "")
                        .map((msg: any) => ({
                            id: msg.id,
                            content: msg.content,
                            chatId: msg.chatId,
                            role: msg.authorRole === 0 ? "User" : "Assistant"
                        }));
                    setMessages(fetchedMessages);
                })
                .catch(error => console.error('Error fetching session messages:', error));
        }
    }, [session]);


    const handleNewMessage = async (message: string) => {
        setMessages(prevMessages => [...prevMessages, { id: "", content: message, role: 'User' }]);

        //get the systme agent from the scenario agents
        const agent = scenario?.agents.find(agent => agent.type === 'system');
        //Same for rolePlay
        const rolePlayAgent = scenario?.agents.find(agent => agent.type === 'rolePlay');
        const promptSystem = agent!.prompt + "/r/n" + rolePlayAgent!.prompt;

        const chatHistory = new ChatHistoryRequest([
            new ChatMessage("", "System", promptSystem),
            ...messages.map(msg => new ChatMessage("", msg.role, msg.content)),
            new ChatMessage("", "User", message)
        ]);
        await callLLMApi(chatHistory);
    };

    const callLLMApi = async (chatHistory: ChatHistoryRequest) => {
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

    const handleDeleteMessage = async (index: number) => {
        //stop the audio
        cancelSpeech();

        const messageToDelete = messages[index];
        try {
            await fetch(`/api/chat/messages/${messageToDelete.id}?chatid=${messageToDelete.chatId}`, {
                method: 'DELETE',
            });
            setMessages(prevMessages => prevMessages.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleSaveSession = async () => {
        try {
            const response = await fetch(`/api/chat/CompleteSession`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId, sessionId }),
            });
            if (response.ok) {
                console.log('Session saved successfully');
            } else {
                console.error('Failed to save session');
            }
        } catch (error) {
            console.error('Error saving session:', error);
        } finally {
            setIsSavingSession(true);
        }
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
            <Button appearance='primary' onClick={handleSaveSession} disabled={isSavingSession}>Validate Session</Button>
            <span>session: {session?.id }</span>

        </div>
    );
}

export default ChatWindow;

