import axios from 'axios';
import { LocaleItem } from '../models/LocaleItem';

export const fetchLanguageData = async (language: string): Promise<LocaleItem[]> => {
    try {
        const response = await axios.get(`/api/localization/${language}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching language data:', error);
        throw error;
    }
};
