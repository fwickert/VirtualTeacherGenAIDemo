import { Button } from '@fluentui/react-components';
import * as SignalR from '@microsoft/signalr';
import { marked } from 'marked';
import { useDashboardContextState } from '../sharedContext/dashboardContextState';
import type { DashboardItem } from '../sharedContext/dashboardContextState';


const hubUrl = process.env.HUB_URL;

let connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()    
    .withUrl(hubUrl)
    .build();

connection.start();


let input: HTMLSpanElement;


const ButtonGenAI = (item: DashboardItem) => {
    const { dashboardState } = useDashboardContextState();

    connection.on(item.prompt!, (data) => {
        const rawMarkup = marked(data);
        
        input.innerHTML = rawMarkup.toString();
    });



    const handleClick = async () => {
        const body = {
            id: item.id,
            chatId: item.chatId,
            conversation: dashboardState.conversation,
            connectionId: connection?.connectionId!,
            title: item.title,
            prompt: item.prompt
        }
        input = document.getElementById(item.prompt!) as HTMLSpanElement;
        input.textContent = "";

        await fetch('/api/dashboard/' + item.prompt, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    };


    return (
        <Button onClick={handleClick}> {item.title}</Button>
    );
};

export { ButtonGenAI }