import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Input,
    makeStyles,
    shorthands,
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
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
import { ChatHistoryRequest, ChatMessage, AuthorRole } from '../../models/ChatHistoryRequest';
import { DeleteMessageRequest } from '../../models/Request/DeleteMessageRequest';
import { DeleteSessionRequest } from '../../models/Request/DeleteSessionRequest';
import { textToSpeechAsync, cancelSpeech } from '../../services/SpeechService';
import { v4 as uuidv4 } from 'uuid';
import { TypingIndicator } from './TypingIndicator';
import { useLocalization } from '../../contexts/LocalizationContext';
import { tokens } from '@fluentui/tokens';
import { Spinner } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { AgentService } from '../../services/AgentService';

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
        ...shorthands.margin('10px', '10px', '0px', '10px'), // Adjusted bottom margin
        height: '500px', // Fixed height
        border: '1px solid #ccc', // Border
        borderRadius: '5px',
        ...shorthands.padding('10px'),
        '@media (max-width: 767px)': {
            height: '300px', // Adjusted height for phone
        },
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.margin('5px', '10px', '10px', '10px'), // Adjusted top margin
    },
    inputField: {
        flexGrow: 1,
        marginRight: '5px',
    },
    deleteMessage: {
        cursor: 'pointer',
        marginLeft: '10px',
        fontSize: '15px',
        color: 'red',
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
    deleteButton: {
        backgroundColor: tokens.colorPaletteRedBackground3,
        color: "white",
        ':hover': {
            backgroundColor: tokens.colorPaletteRedForeground1,
            color: 'white',
        },
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        ...shorthands.margin('10px', '10px', '0px', '10px'),
    },
    spinnerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
});

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
    const navigate = useNavigate();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [sessionId, setSessionId] = useState<string>("");
    const currentMessageRef = useRef<string | null>(null);
    const [isSavingSession, setIsSavingSession] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
    const [isValidateConfirmOpen, setIsValidateConfirmOpen] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [hasFiles, setHasFiles] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
    const { getTranslation } = useLocalization();

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

        checkRolePlayAgentFiles();

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
            console.log('SessionId:', message.sessionId);
            setMessages(prevMessages => {
                return prevMessages.map(msg => {
                    if (msg.sessionId === "") {
                        return { ...msg, sessionId: message.sessionId };
                    }
                    return msg;
                });
            });

        });

        connection.on('StartMessageUpdate', (_: Message) => {
            setIsTyping(true);
        });

        connection.on('InProgressMessageUpdate', (message: Message) => {
            setIsTyping(false);
            currentMessageRef.current = message.content;

            setMessages(prevMessages => {
                const existingMessageIndex = prevMessages.findIndex(msg => msg.id === message.id);
                if (existingMessageIndex !== -1) {
                    const updatedMessages = [...prevMessages];
                    updatedMessages[existingMessageIndex] = { ...updatedMessages[existingMessageIndex], content: message.content };
                    return updatedMessages;
                } else {
                    return [...prevMessages, {
                        id: message.id,
                        sessionId: message.sessionId,
                        content: message.content,
                        authorRole: AuthorRole.Assistant
                    }];
                }
            });
        });


        connection.on('EndMessageUpdate', (message: any) => {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                // Find the last assistant message
                const lastMessage = updatedMessages.slice().reverse().find(msg => msg.authorRole === AuthorRole.Assistant);
                if (lastMessage) {
                    lastMessage.sessionId = message.sessionId;
                    lastMessage.id = message.messageId;
                }
                return updatedMessages;
            });

            textToSpeechAsync(message.content);
        });
    };

    const checkRolePlayAgentFiles = async () => {
        const currentScenario = scenario?.agents || session?.agents;
        const rolePlayAgent = currentScenario?.find(agent => agent.type === 'rolePlay');
        if (rolePlayAgent) {
            const result = await AgentService.hasFiles(rolePlayAgent.id);
            setHasFiles(result.data);
        }
    };

    useEffect(() => {
        if (session) {
            setIsLoadingMessages(true);
            getMessages(session.id)
                .then(data => {
                    const fetchedMessages = data
                        .filter((msg: Message) => msg.content !== "")
                        .map((msg: Message) => ({
                            id: msg.id,
                            content: msg.content,
                            sessionId: session.id,
                            authorRole: msg.authorRole
                        })
                        );
                    setMessages(fetchedMessages);

                })
                .catch(error => console.error('Error fetching session messages:', error))
                .finally(() => setIsLoadingMessages(false));

        }
    }, [session]);

    const handleNewMessage = async (message: string) => {
        const messageUserId = uuidv4();
        setMessages(prevMessages => [...prevMessages, { id: messageUserId, sessionId: session?.id || sessionId, content: message, authorRole: AuthorRole.User }]);

        const currentScenario = scenario?.agents || session?.agents;
        const agent = currentScenario?.find(agent => agent.type === 'system');
        const rolePlayAgent = currentScenario?.find(agent => agent.type === 'rolePlay');

        //const promptSystem = agent!.prompt + "\n\n[ROLEPLAY]\n\n" + rolePlayAgent!.prompt;

        const promptSystem = agent!.prompt + "\n\n" + rolePlayAgent!.prompt;
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
            new ChatMessage(uuidv4(), AuthorRole.System, promptSystem),
            ...messages.map(msg => new ChatMessage(msg.id, msg.authorRole, msg.content)),
            new ChatMessage(messageUserId, AuthorRole.User, message)
        ]);

        await sendMessage(chatHistory, rolePlayAgent?.id, connection?.connectionId, hasFiles);
    };

    const handleDeleteMessage = async (id: string) => {
        //stop the audio
        cancelSpeech();
        console.log("id: ", id);
        const messageToDelete = messages.find(msg => msg.id === id);
        console.log("msg: ", messages);
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

    const handleSaveSession = async () => {
        setIsValidateConfirmOpen(true);
    };

    const confirmSaveSession = async () => {
        setIsProcessing(true);
        setIsSavingSession(true);
        try {
            console.log('Saving session...', sessionId);
            await saveSession(session?.id || sessionId, userName, connection?.connectionId);
            console.log('Session saved successfully');
            navigate('/lastTraining');
        } catch (error) {
            console.error('Error saving session:', error);
        } finally {
            setIsProcessing(false);
            setIsValidateConfirmOpen(false);
        }
    };

    const deleteSession = async () => {
        setIsProcessing(true);
        const deleteRequest = new DeleteSessionRequest(session?.id || sessionId, session?.userId || userName);

        try {
            await deleteSessionService(deleteRequest);
            setMessages([]);
            navigate('/session');
        } catch (error) {
            console.error('Error deleting session:', error);
        } finally {
            setIsProcessing(false);
            setIsDeleteConfirmOpen(false);
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

    const handleOpenChange = (_event: any, data: { open: boolean }) => {
        setIsDeleteConfirmOpen(data.open);
    };

    const handleValidateOpenChange = (_event: any, data: { open: boolean }) => {
        setIsValidateConfirmOpen(data.open);
    };

    return (
        <div className={styles.chatContainer}>
            {isLoadingMessages && <div className={styles.spinnerOverlay}><Spinner /></div>}
            <div className={styles.messagesContainer} style={{ pointerEvents: isLoadingMessages ? 'none' : 'auto' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles.messageContainer}>
                        <div className={msg.authorRole === AuthorRole.User ? styles.userMessage : styles.assistantMessage}>
                            {msg.content}
                            <span className={styles.deleteMessage} onClick={() => handleDeleteMessage(msg.id)}>&times;</span>
                        </div>
                    </div>
                ))}
                {isTyping && <TypingIndicator />}
            </div>
            <div className={styles.inputContainer}>
                <Input
                    placeholder={getTranslation("TypeYourMessage")}
                    value={inputText}
                    onChange={(_e, data) => setInputText(data.value)}
                    onKeyDown={handleKeyDown}
                    className={`${styles.inputField}`}
                    disabled={isLoadingMessages}
                />
                <Button icon={<SendFilled />} onClick={handleSendClick} disabled={isLoadingMessages} />
                <div className="micButtonContainer">
                    <SpeechRecognizer onNewMessage={handleNewMessageFromSpeech} disabled={isLoadingMessages} />
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <Button className={styles.deleteButton} onClick={() => setIsDeleteConfirmOpen(true)}>{getTranslation("DeleteSession")}</Button>
                <Button appearance='primary' onClick={handleSaveSession} disabled={isSavingSession}>{getTranslation("ValidateSession")}</Button>
            </div>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={handleOpenChange}>
                <DialogSurface>
                    <DialogBody>
                        {isProcessing && <div className={styles.spinnerOverlay}><Spinner label={getTranslation("Processing")} /></div>}
                        <DialogTitle>{getTranslation("DeleteAskTitle")}</DialogTitle>
                        <DialogContent>
                            <p>{getTranslation("DeleteSessionAskMessage")}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button className={styles.deleteButton} onClick={deleteSession} disabled={isProcessing}>
                                {getTranslation("DeleteButton")}
                            </Button>
                            <Button appearance="secondary" onClick={() => setIsDeleteConfirmOpen(false)} disabled={isProcessing}>
                                {getTranslation("CancelButton")}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            <Dialog open={isValidateConfirmOpen} onOpenChange={handleValidateOpenChange}>
                <DialogSurface>
                    <DialogBody>
                        {isProcessing && <div className={styles.spinnerOverlay}><Spinner label={getTranslation("Processing")} /></div>}
                        <DialogTitle>{getTranslation("ValidateAskTitle")}</DialogTitle>
                        <DialogContent>
                            <p>{getTranslation("ValidateSessionAskMessage")}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="primary" onClick={confirmSaveSession} disabled={isProcessing}>
                                {getTranslation("ValidateButton")}
                            </Button>
                            <Button appearance="secondary" onClick={() => setIsValidateConfirmOpen(false)} disabled={isProcessing}>
                                {getTranslation("CancelButton")}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </div>
    );
};

export default Chat;
