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
    upsertAgent: (agent: AgentItem, isUpdate: boolean) => {
        const apiUrl = isUpdate ? `/agent/${agent.id}` : '/agent';
        const method = isUpdate ? 'put' : 'post';
        return apiClient[method](apiUrl, agent);
    },
    cloneAgent(agent: AgentItem) {
        return axios.post('/api/agent/clone', agent);
    },
    deleteAgent: (agentId: string, type: string) => {
        return apiClient.delete(`/agent/${agentId}?type=${type}`);
    },
    hasFiles: (agentId: string) => {
        return apiClient.get<boolean>(`/agent/HasFiles/${agentId}`);
    },
};
