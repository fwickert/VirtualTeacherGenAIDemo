import axios from 'axios';
import { SessionItem } from '../models/SessionItem';

export class SessionService {
    static async getIncompleteSessions(userName: string) {
        return axios.get<SessionItem[]>(`/api/Session/NotCompleted/${userName}`);
    }

    static async getSessionHistory(userName: string) {
        return axios.get<SessionItem[]>(`/api/Session/history/${userName}`);
    }
}
