import './chatHistory.css';
import { Spinner } from '@fluentui/react-spinner';

enum AuthorRoles {
    User = 0,
    Assistant = 1,
}

export interface IChat {
    id: string;
    chatId: string;
    content: string;
    timestamp: string;
    authorRole: AuthorRoles
}

interface ChatHistoryProps {
    conversation: IChat[];
}
const ChatHistory: React.FC<ChatHistoryProps> = ({ conversation }) => {

    return (
        <div id="history" className="frame window">
            {
                conversation === undefined ?
                    <div>
                        <Spinner className="spinner" />
                    </div>
                    :
                   
                        <div className="chat-messages">
                            {conversation.map((message: IChat) => (
                                message.content.length !== 0 ?

                                    <div key={message.id} className={`chat-message ${message.authorRole === 0 ? 'user-message' : 'assistant-message'}`}>
                                        {message.content}

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
