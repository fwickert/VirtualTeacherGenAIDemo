import axios from 'axios';
import { IChat } from '../components/dashboard/chatHistory';

class DashboardService {
    async getConversation(sessionId: string): Promise<IChat[]> {
        const response = await axios.get(`/api/chat/messages/${sessionId}`);
        return response.data;
    }

    async postFeature(feature: string, sessionId: string, userName: string, body: any, refreshUI: boolean): Promise<any> {
        const response = await axios.post(`/api/dashboard/${feature}`, body, {
            params: {
                sessionId: sessionId,
                userName: userName,
                refreshUI: refreshUI
            }
        });
        return response.data;
    }

    async getDashboardData(chatId: string): Promise<any> {
        const response = await axios.get(`/api/dashboard?chatId=${chatId}`);
        return response.data;
    }
}

export default new DashboardService();
