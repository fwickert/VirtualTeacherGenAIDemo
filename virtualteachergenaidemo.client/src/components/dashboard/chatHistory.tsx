import './chatHistory.css';
import { Spinner } from '@fluentui/react-components';

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
                    Array.isArray(conversation) ?
                        conversation.map((message: IChat) => (
                            message.content.length !== 0 ?
                                <div key={message.id}>
                                    {message.authorRole === AuthorRoles.User ?
                                        <div className="left">
                                            <span>
                                                <strong>Seller</strong>:&nbsp;
                                            </span>
                                            {message.content}
                                        </div>
                                        :
                                        <div className="right">
                                            <span>
                                                <strong>Client</strong>:&nbsp;
                                            </span>
                                            {message.content}
                                        </div>
                                    }
                                </div>
                                :
                                null
                        )) :
                        null                    
            }
        </div>
    );
}

export default ChatHistory;
