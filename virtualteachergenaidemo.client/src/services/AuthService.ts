import axios from 'axios';
import { AuthConfig } from '../auth/authConfig';

export const fetchAuthConfig = async (): Promise<AuthConfig> => {
    try {
        const response = await axios.get('/api/auth-config');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch auth config');
    }
};
