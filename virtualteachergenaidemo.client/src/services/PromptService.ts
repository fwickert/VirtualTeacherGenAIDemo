import axios from 'axios';

class PromptService {
    async getPrompt(prompt: string): Promise<string> {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: {
                functionName: prompt,
                plugin: 'DashboardPlugin'
            },
        };

        const response = await axios('/api/prompt', requestOptions);
        return response.data;
    }
}

export default new PromptService();
