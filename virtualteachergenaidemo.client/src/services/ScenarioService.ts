import axios from 'axios';
import { ScenarioItem } from '../models/ScenarioItem';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ScenarioService = {
    getAllScenarios: (user: string) => {
        return apiClient.get<ScenarioItem[]>(`/scenario?user=${user}`);
    },
    addScenario: (scenario: ScenarioItem) => {
        return apiClient.post('/scenario', scenario);
    },
    updateScenario: (scenario: ScenarioItem) => {
        return apiClient.put(`/scenario/${scenario.id}`, scenario);
    },
    deleteScenario: (scenarioId: string) => {
        return apiClient.delete(`/scenario/${scenarioId}`);
    },
};

