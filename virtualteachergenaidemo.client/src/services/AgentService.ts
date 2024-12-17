import axios from 'axios';
import { AgentItem } from '../models/AgentItem';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const AgentService = {
    getAllAgents: () => {
        return apiClient.get<AgentItem[]>('/agent/all');
    },
    getAgentsByType: (type: string) => {
        return apiClient.get<AgentItem[]>(`/agent/ByType?type=${type}`);
    },
    upsertAgent: (agent: AgentItem) => {
        const apiUrl = agent.id ? `/agent/${agent.id}` : '/agent';
        const method = agent.id ? 'put' : 'post';
        return apiClient[method](apiUrl, agent);
    },
    deleteAgent: (agentId: string, type: string) => {
        return apiClient.delete(`/agent/${agentId}?type=${type}`);
    },
};
