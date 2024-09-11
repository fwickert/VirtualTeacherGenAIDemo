import { Button } from '@fluentui/react-components';
import * as SignalR from '@microsoft/signalr';
import { marked } from 'marked';

interface IDashboardRequestProps {
    id?: string;
    chatId?: string;
    conversation?: string;
    connectionId?: string;
    title?: string;
    prompt?: string;
}

let connection: SignalR.HubConnection = new SignalR.HubConnectionBuilder()
    .withUrl("https://localhost:7273/messageRelayHub")
    .build();

connection.start();



let input: HTMLSpanElement;


const ButtonGenAI = (props: IDashboardRequestProps) => {
    connection.on(props.prompt!, (data) => {
        const rawMarkup = marked(data);
        input.innerHTML = rawMarkup.toString();
    });

    const handleClick = async () => {
        const body: IDashboardRequestProps = {
            id: props.id,
            chatId: props.chatId,
            conversation: document.getElementById("history")?.textContent!,
            connectionId: connection?.connectionId!,
            title: props.title,
            prompt: props.prompt
        }


        input = document.getElementById(props.prompt!) as HTMLSpanElement;
        input.textContent = "";


        await fetch('/api/dashboard/' + props.prompt, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    };

    return (
        <Button onClick={handleClick}>{props.title}</Button>
    );
};

export { type IDashboardRequestProps, ButtonGenAI }