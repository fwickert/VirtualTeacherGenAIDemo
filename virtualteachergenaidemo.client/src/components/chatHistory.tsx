import './chatHistory.css';
import * as React from 'react';
import { useState, useEffect } from 'react';



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
    const [chat, setChat] = useState<IChat[]>();



    useEffect(() => {
        getChat(props.chatId);
    }, []);

    async function getChat(chatid: string) {
        const response = await fetch('/api/chat/messages?chatId=' + chatid);
        const data = await response.json();
        setChat(data);
    }


    return (
        <div className="frame">
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