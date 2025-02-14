import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchLanguageData } from '../services/localizationService';
import { LocaleItem } from '../models/LocaleItem';

interface LocalizationContextProps {
    translations: LocaleItem[];
    getTranslation: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextProps | undefined>(undefined);

export const LocalizationProvider: React.FC<{ lang: string, children: React.ReactNode }> = ({ lang, children }) => {
    const [translations, setTranslations] = useState<LocaleItem[]>([]);

    useEffect(() => {
        const loadTranslations = async () => {
            const data = await fetchLanguageData(lang);            
            setTranslations(data);
        };

        loadTranslations();
    }, [lang]);

    const getTranslation = (key: string) => {
        const item = translations.find(t => t.key === key);
        return item ? item.value : key;
    };

    return (
        <LocalizationContext.Provider value={{ translations, getTranslation }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
