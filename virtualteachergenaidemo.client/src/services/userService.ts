// src/services/userService.ts
import axios from 'axios';
import { UserRoleEnum } from '../models/UserRoleEnum';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getUserRole = async (email: string) => {
    try {
        const response = await apiClient.get(`/User/${email}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.status === 404) {
                    return null;
                }
                // Server responded with a status other than 2xx
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // Request was made but no response was received
                console.error('Error request:', error.request);
            } else {
                // Something happened in setting up the request
                console.error('Error message:', error.message);
            }
        } else {
            // Non-Axios error
            console.error('Error:', error);
        }
        throw error;
    }
};


export const createUser = async (email: string) => {
    try {
        const response = await apiClient.post('/User', {
            id: email,
            name: email,
            role: UserRoleEnum.User,
            settings: {}
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
