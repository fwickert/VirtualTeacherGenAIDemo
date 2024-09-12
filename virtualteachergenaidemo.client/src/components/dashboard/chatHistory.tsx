import './chatHistory.css';
import { useState, useEffect } from 'react';
import { Spinner } from '@fluentui/react-components';
import { useDashboardContextState } from '../sharedContext/dashboardContextState';


enum AuthorRoles {
    User = 0,
    Assistant = 1,
}

interface IChat {
    id: string;
    chatId: string;
    content: string;
    timestamp: string;
    authorRole: AuthorRoles
}

function ChatHistory(props: any) {
    const { dashboardState, setDashboardState } = useDashboardContextState();
    const [chat, setChat] = useState<IChat[]>();

    useEffect(() => {
        getChat(props.chatId);
    }, []);

    async function getChat(chatid: string) {
        const response = await fetch('/api/chat/messages?chatId=' + chatid);
        const data = await response.json();

        setChat(data);

        //const conversation = data?.map((message: IChat) => message.content).join(" ");
        //setDashboardState({ ...dashboardState, conversation: conversation! });
    }

    
    useEffect(() => {
        const conversation = chat?.map((message: IChat) => message.content).join(" ");
        setDashboardState({ ...dashboardState, conversation: conversation! });
    }, [chat]);
    
   
    return (
        chat === undefined ?
            <Spinner />
            :
            <div id="history" className="frame window">
                {
                    chat?.map((message: IChat) => (                        
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
                            ""
                    ))
                    
                }

            </div>
    );
}

export default ChatHistory;