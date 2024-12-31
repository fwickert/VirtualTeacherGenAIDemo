import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Input,
    makeStyles,
    shorthands,
} from '@fluentui/react-components';
import {
    SendFilled,
} from '@fluentui/react-icons';
import { ScenarioItem } from '../../models/ScenarioItem';
import { SessionItem } from '../../models/SessionItem';
import SpeechRecognizer from '../speechRecognizer/speechRecognizer';
import { HubConnection } from '@microsoft/signalr';
import { useUsername } from '../../auth/UserContext';
import { getMessages, sendMessage, deleteMessage, saveSession, deleteSession as deleteSessionService } from '../../services/ChatService';
import { getHubConnection } from '../../services/signalR';
import { ChatHistoryRequest, ChatMessage } from '../../models/ChatHistoryRequest';
import { DeleteMessageRequest } from '../../models/Request/DeleteMessageRequest';
import { DeleteSessionRequest } from '../../models/Request/DeleteSessionRequest';
import { textToSpeechAsync, cancelSpeech } from '../../services/SpeechService';

const useStyles = makeStyles({
    chatContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        ...shorthands.padding('5px'),
        '@media (min-width: 768px)': {
            width: '50%',
            margin: '0 auto',
        },
    },
    messagesContainer: {
        flexGrow: 1,
        overflowY: 'auto',
        ...shorthands.margin('10px'),
        height: '500px', // Fixed height
        border: '1px solid #ccc', // Border
        ...shorthands.padding('10px'),
        '@media (max-width: 767px)': {
            height: '300px', // Adjusted height for phone
        },
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.margin('10px'),
    },
    inputField: {
        flexGrow: 1,
        marginRight: '5px',
    },
    deleteMessage: {
        cursor: 'pointer',
    },
    userMessage: {
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
        alignSelf: 'flex-end',
        maxWidth: '50%',
    },
    assistantMessage: {
        backgroundColor: '#e0e0e0',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
        alignSelf: 'flex-start',
        maxWidth: '50%',
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
});

enum AuthorRole {
    User,
    Assistant
}

interface Message {
    content: string;
    sessionId?: string;
    id: string;
    authorRole: AuthorRole;
}

interface ChatProps {
    scenario: ScenarioItem | null;
    session: SessionItem | null;
}

const Chat: React.FC<ChatProps> = ({ scenario, session }) => {
    const styles = useStyles();
    const userName = useUsername();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [sessionId, setSessionId] = useState<string>("");
    const currentMessageRef = useRef<string | null>(null);
    const [isSavingSession, setIsSavingSession] = useState<boolean>(false);

    useEffect(() => {
        const setupConnection = async () => {
            try {
                const newConnection = await getHubConnection();
                setConnection(newConnection);
                setupConnectionHandlers(newConnection);
            } catch (error) {
                console.error('Connection failed: ', error);
            }
        };

        setupConnection();
    }, []);

    const removeConnectionHandlers = (connection: HubConnection) => {
        connection.off('SessionInsert');
        connection.off('StartMessageUpdate');
        connection.off('InProgressMessageUpdate');
        connection.off('EndMessageUpdate');
        connection.off('MessageIdUpdate');
    };

    const setupConnectionHandlers = (connection: HubConnection) => {
        removeConnectionHandlers(connection);

        connection.on('SessionInsert', (message: any) => {
            setSessionId(message.sessionId);
        });

        connection.on('StartMessageUpdate', (message: any) => {
            currentMessageRef.current = message.content;
            setMessages(prevMessages => [...prevMessages, {
                id: message.messageId,
                sessionId: message.sessionId,
                content: message.content,
                authorRole: AuthorRole.Assistant
            }]);
        });

        connection.on('InProgressMessageUpdate', (message: any) => {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = { id: message.id, sessionId: message.sessionId, content: message.content, authorRole: AuthorRole.Assistant };
                return updatedMessages;
            });
        });

        connection.on('EndMessageUpdate', (message: any) => {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].sessionId = message.sessionId;
                return updatedMessages;
            });
            textToSpeechAsync(message.content);
        });

        connection.on('MessageIdUpdate', (message: any) => {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                const lastUserMessage = updatedMessages.find(msg => msg.authorRole === AuthorRole.User);
                if (lastUserMessage) {
                    lastUserMessage.id = message.id;
                }
                return updatedMessages;
            });
        });
    };

    useEffect(() => {
        if (session) {
            getMessages(session.id)
                .then(data => {
                    const fetchedMessages = data
                        .filter((msg: Message) => msg.content !== "")
                        .map((msg: Message) => ({
                            id: msg.id,
                            content: msg.content,
                            sessionId: msg.sessionId,
                            authorRole: msg.authorRole
                        })
                        );
                    setMessages(fetchedMessages);
                    console.log("fetchedMessages: ", fetchedMessages);
                })
                .catch(error => console.error('Error fetching session messages:', error));

            console.log("sessionId: ", session.id);
        }
    }, [session]);

    const handleNewMessage = async (message: string) => {
        setMessages(prevMessages => [...prevMessages, { id: "", sessionId: sessionId, content: message, authorRole: AuthorRole.User }]);

        const currentScenario = scenario?.agents || session?.agents;
        const agent = currentScenario?.find(agent => agent.type === 'system');
        const rolePlayAgent = currentScenario?.find(agent => agent.type === 'rolePlay');

        const promptSystem = agent!.prompt + "\n\n[ROLEPLAY]\n\n" + rolePlayAgent!.prompt;

        console.log("prompsystem: ", promptSystem);

        const scenarioName = scenario?.name || session?.scenarioName;
        const scenarioDescription = scenario?.description || session?.scenarioDescription;

        //Create ISessionItem object
        const sessionItem: SessionItem = {
            id: session?.id || sessionId,
            timestamp: new Date(),
            userId: userName,
            scenarioName: scenarioName || '',
            scenarioDescription: scenarioDescription || '',
            agents: currentScenario?.map(agent => ({
                prompt: agent.prompt,
                name: agent.name,
                type: agent.type,
                id: agent.id,
                features: agent.type === 'teacher' ? agent.features : undefined
            })) || []
        };

        const chatHistory = new ChatHistoryRequest(userName, sessionItem, [
            new ChatMessage("", "System", promptSystem),
            ...messages.map(msg => new ChatMessage("", msg.authorRole.toString(), msg.content)),
            new ChatMessage("", "User", message)
        ]);
        console.log(chatHistory);

        await sendMessage(chatHistory, rolePlayAgent?.id, connection?.connectionId);
    };

    const handleDeleteMessage = async (id: string) => {
        //stop the audio
        cancelSpeech();

        const messageToDelete = messages.find(msg => msg.id === id);
        if (messageToDelete !== null && messageToDelete !== undefined) {
            const deleteRequest = new DeleteMessageRequest(messageToDelete.id, messageToDelete.sessionId!);

            try {
                await deleteMessage(deleteRequest);
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const handleSaveSession = async (sessionId: string | undefined) => {
        try {
            await saveSession(sessionId, userName, connection?.connectionId);
            console.log('Session saved successfully');
        } catch (error) {
            console.error('Error saving session:', error);
        } finally {
            setIsSavingSession(true);
        }
    };

    const deleteSession = async () => {
        if (!session) return;

        const deleteRequest = new DeleteSessionRequest(session.id, session.userId);

        try {
            await deleteSessionService(deleteRequest);
            alert('Session deleted successfully');
            setMessages([]);
        } catch (error) {
            console.error('Error deleting session:', error);
            alert('Failed to delete session');
        }
    };

    const handleSendClick = () => {
        handleNewMessage(inputText);
        setInputText('');
    };

    const handleNewMessageFromSpeech = (message: string) => {
        handleNewMessage(message);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendClick();
        }
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles.messageContainer}>
                        <div className={msg.authorRole === AuthorRole.User ? styles.userMessage : styles.assistantMessage}>
                            {msg.content}
                            <span className={styles.deleteMessage} onClick={() => handleDeleteMessage(msg.id)}>&times;</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <Input
                    placeholder="Type your message"
                    value={inputText}
                    onChange={(_e, data) => setInputText(data.value)}
                    onKeyDown={handleKeyDown}
                    className={`${styles.inputField}`}
                />
                <Button icon={<SendFilled />} onClick={handleSendClick} />
                <div className="micButtonContainer">
                    <SpeechRecognizer onNewMessage={handleNewMessageFromSpeech} />
                </div>
            </div>
            <Button appearance='primary' onClick={() => handleSaveSession(session?.id)} disabled={isSavingSession}>Validate Session</Button>
            <Button appearance='secondary' onClick={() => deleteSession()}>Delete session</Button>
        </div>
    );
};

export default Chat;