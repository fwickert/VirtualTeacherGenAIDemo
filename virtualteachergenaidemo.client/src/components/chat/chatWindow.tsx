import './chatWindow.css';
import { useState, useEffect, useRef } from 'react';
import SpeechRecognizer from '../speechRecognizer/speechRecognizer';
import AudioVisualizer from '../speechRecognizer/AudioVisualizer';
import { ChatHistoryRequest, ChatMessage } from '../../models/ChatHistoryRequest';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { textToSpeechAsync, cancelSpeech } from '../../services/speechService';
import { ScenarioItem } from '../../models/ScenarioItem';
import { ISessionItem } from '../../models/SessionItem';
import { Button } from '@fluentui/react-button';
import { useUsername } from '../../auth/UserContext'; 

enum AuthorRole {
    User = 0,
    Assistant = 1
}

interface Message {
    content: string;    
    sessionId?: string;    
    id: string;
    authorRole: AuthorRole;
}

interface ChatWindowProps {
    scenario?: ScenarioItem | undefined;
    session?: ISessionItem;
}

function ChatWindow({ scenario, session }: ChatWindowProps) {
    const userName = useUsername();
    const [messages, setMessages] = useState<Message[]>([]);
    const [connection, setConnection] = useState<HubConnection | null>(null);    
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
                            
                            setMessages(prevMessages => [...prevMessages, {id:message.id, sessionId: message.sessionId, content: message.content, authorRole: AuthorRole.Assistant }]);
                        } else if (message.state === "InProgress") {
                            setMessages(prevMessages => {
                                const updatedMessages = [...prevMessages];
                                updatedMessages[updatedMessages.length - 1] = {id:message.id, sessionId: message.sessionId, content: message.content, authorRole: AuthorRole.Assistant }
                                return updatedMessages;
                            });
                        } else if (message.state === "End") {
                            //find message by id and update it with the id from the server
                            setMessages(prevMessages => {
                                const updatedMessages = [...prevMessages];
                                updatedMessages[updatedMessages.length - 1].sessionId = message.sessionId;                                
                                return updatedMessages;
                            });
                            textToSpeechAsync(message.content);
                        }
                    });

                    connection.on('UserIDUpdate', (message: any) => {
                        setMessages(prevMessages => {
                            const updatedMessages = [...prevMessages];
                            const lastUserMessageIndex = updatedMessages.slice().reverse().findIndex(msg => msg.authorRole === AuthorRole.User);
                            if (lastUserMessageIndex !== -1) {
                                const index = updatedMessages.length - 1 - lastUserMessageIndex;                                
                                updatedMessages[index] = { ...updatedMessages[index], sessionId: message.sessionId};
                            }
                            return updatedMessages;
                        });
                    });

                    connection.on('SessionInsert', (message: any) => {
                        setSessionId(message.sessionId);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    useEffect(() => {        
        if (session) {
            fetch(`/api/chat/messages/${session.id}`)
                .then(response => response.json())
                .then(data => {
                    const fetchedMessages = data
                        .filter((msg: Message) => msg.content !== "")
                        .map((msg: Message) => ({
                            id: msg.sessionId,
                            content: msg.content,
                            sessionID: msg.sessionId,
                            authorRole: msg.authorRole
                        }));
                    setMessages(fetchedMessages);                    
                })
                .catch(error => console.error('Error fetching session messages:', error));
        }
    }, [session]);


    const handleNewMessage = async (message: string) => {
        setMessages(prevMessages => [...prevMessages, { id: "", sessionId: sessionId, content: message, authorRole: AuthorRole.User}]);

        
        const currentScenario = scenario?.agents || session?.agents;
        const agent = currentScenario?.find(agent => agent.type === 'system');
        const rolePlayAgent = currentScenario?.find(agent => agent.type === 'rolePlay');
        const promptSystem = agent!.prompt + "/r/n" + rolePlayAgent!.prompt;

        const scenarioName = scenario?.name || session?.scenarioName;
        const scenarioDescription = scenario?.description || session?.scenarioDescription;

        //Create ISessionItem object
        const sessionItem: ISessionItem = {
            id: session?.id || sessionId,
            timestamp: new Date(),
            userId: userName,
            scenarioName: scenarioName || '',
            scenarioDescription: scenarioDescription || '',
            agents: currentScenario?.map(agent => ({
                prompt: agent.prompt,
                type: agent.type
            })) || []
        };


        const chatHistory = new ChatHistoryRequest(userName, sessionItem, [
            new ChatMessage("", "System", promptSystem),
            ...messages.map(msg => new ChatMessage("", msg.authorRole.toString(), msg.content)),
            new ChatMessage("", "User", message)
        ]);
        console.log(chatHistory);

        await callLLMApi(chatHistory);
    };

    const callLLMApi = async (chatHistory: ChatHistoryRequest) => {
        console.log(chatHistory);
        try {
            const response = await fetch(`/api/chat/message?sessionId=${sessionId}`, {
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
            await fetch(`/api/chat/messages/${messageToDelete.id}?sessionId=${messageToDelete.sessionId}`, {
                method: 'DELETE',
            });
            setMessages(prevMessages => prevMessages.filter((_, i) => i !== index));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleSaveSession = async (sessionId: string | undefined) => {
        try {
            const response = await fetch(`/api/Session/CompleteSession`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId, userId: userName }),
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
                                <div key={index} className={`chat-message ${msg.authorRole === AuthorRole.User ? 'user-message' : 'assistant-message'}`}>
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
            <Button appearance='primary' onClick={() =>handleSaveSession(session?.id)} disabled={isSavingSession}>Validate Session</Button>            

        </div>
    );
}

export default ChatWindow;

