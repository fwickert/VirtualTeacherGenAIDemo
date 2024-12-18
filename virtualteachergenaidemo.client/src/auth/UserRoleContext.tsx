// src/auth/UserRoleContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { UserRoleEnum } from '../models/UserRoleEnum';

interface UserRoleContextType {
    role: UserRoleEnum | null;
    setRole: (role: UserRoleEnum) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider: React.FC<({ children: React.ReactNode })> = ({children }) => {
    const [role, setRole] = useState<UserRoleEnum | null>(null);

    return (
        <UserRoleContext.Provider value={{ role, setRole }}>
            {children}
        </UserRoleContext.Provider>
    );
};

export const useUserRole = (): UserRoleContextType => {
    const context = useContext(UserRoleContext);
    if (!context) {
        throw new Error('useUserRole must be used within a UserRoleProvider');
    }
    return context;
};
