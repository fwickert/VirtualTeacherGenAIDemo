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
        if (error.response && error.response.status === 404) {
            return null;
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
