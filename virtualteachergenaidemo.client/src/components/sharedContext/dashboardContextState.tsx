import React, { createContext, useContext, useState } from 'react';

export interface DashboardState {    
    conversation: string;    
    connectionId?: string;
    items: DashboardItem[];
}

export interface DashboardItem {
    id?: string;
    chatId?: string;
    title?: string;
    prompt?: string;
    infoType?: string;
    content?: string;
}

interface IDashboardContextStateProps {
    dashboardState: DashboardState;
    setDashboardState: React.Dispatch<React.SetStateAction<DashboardState>>;
}

const DashboardContextState = createContext<IDashboardContextStateProps | undefined>(undefined);

const dashboardInit: DashboardState = {
    items: [],
    connectionId: "",
    conversation: ""
};

export const DashboardContextStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dashboardState, setDashboardState] = useState<DashboardState>(dashboardInit);

    return (
        <DashboardContextState.Provider value={{ dashboardState, setDashboardState}}>
            {children}
        </DashboardContextState.Provider>
    );
};

export const useDashboardContextState = () => {
    const context = useContext(DashboardContextState);
    if (!context) {
        throw new Error('useDashboardContextState must be used within a SharedStateProvider');
    }
    return context;
};