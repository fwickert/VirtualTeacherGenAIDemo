import './chatHistory.css';
import { Spinner } from '@fluentui/react-spinner';
import { useLocalization } from '../../contexts/LocalizationContext';

enum AuthorRoles {
    User = 0,
    Assistant = 1,
}

export interface IChat {
    id: string;
    sessionId: string;
    content: string;
    timestamp: string;
    authorRole: AuthorRoles
}

interface ChatHistoryProps {
    conversation: IChat[];
}
const ChatHistory: React.FC<ChatHistoryProps> = ({ conversation }) => {
    const { getTranslation } = useLocalization();

    return (
        <div id="history" className="frame window">
            {
                conversation === undefined ?
                    <div>
                        <Spinner className="spinner" />
                    </div>
                    :
                    <div className="dashboard-chat-messages">
                        {conversation.map((message: IChat) => (
                            message.content.length !== 0 ?
                                <div key={message.id} className={`dashboard-chat-message ${message.authorRole === AuthorRoles.User ? 'dashboard-user-message' : 'dashboard-assistant-message'}`}>
                                    <strong>{(message.authorRole === AuthorRoles.User ? getTranslation("SellerRole") : getTranslation("ClientRole")) + " : "} </strong>{message.content}
                                </div>
                                :
                                null
                        ))}
                    </div>
            }
        </div>
    );
}

export default ChatHistory;
