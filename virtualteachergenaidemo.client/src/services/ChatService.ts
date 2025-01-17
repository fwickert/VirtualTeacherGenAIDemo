import axios from 'axios';
import { ChatHistoryRequest } from '../models/ChatHistoryRequest';
import { DeleteMessageRequest } from '../models/Request/DeleteMessageRequest';
import { DeleteSessionRequest } from '../models/Request/DeleteSessionRequest';

const API_BASE_URL = '/api';

export const getMessages = async (sessionId: string) => {
    const response = await axios.get(`${API_BASE_URL}/chat/messages/${sessionId}`);
    return response.data;
};

export const sendMessage = async (chatHistory: ChatHistoryRequest, agentId: string | undefined, connectionId: string | null | undefined, hasFiles:boolean) => {
    const response = await axios.post(`${API_BASE_URL}/chat/message`, chatHistory, {
        params: { agentId, connectionId, hasFiles }
    });
    return response.data;
};

export const deleteMessage = async (deleteRequest: DeleteMessageRequest) => {
    const response = await axios.delete(`${API_BASE_URL}/chat/message/${deleteRequest.messageId}`, {
        data: deleteRequest
    });
    return response.data;
};

export const saveSession = async (sessionId: string | undefined, userId: string, connectionId: string | null | undefined) => {
    const response = await axios.post(`${API_BASE_URL}/Session/CompleteSession`, { sessionId, userId }, {
        params: { connectionId }
    });
    return response.data;
};


export const deleteSession = async (deleteRequest: DeleteSessionRequest) => {
    const response = await axios.delete(`${API_BASE_URL}/session/delete`, {
        data: deleteRequest
    });
    return response.data;
};
