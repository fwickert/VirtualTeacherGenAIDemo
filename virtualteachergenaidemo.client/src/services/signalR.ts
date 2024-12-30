import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

let connection: HubConnection | null = null;

export const getHubConnection = async (): Promise<HubConnection> => {

    if (!connection) {

        console.log('Creating new connection');
        const hubUrl = process.env.HUB_URL;
        if (!hubUrl) {
            throw new Error("HUB_URL is not defined in the environment variables.");
        }

        connection = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .build();

        try {
            await connection.start();
            console.log('Connection started');
        } catch (error) {
            console.error('Error starting connection: ', error);
            throw error;
        }
    }

    return connection;
};
