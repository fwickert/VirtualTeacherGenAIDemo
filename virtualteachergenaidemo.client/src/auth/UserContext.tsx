// UserContext.tsx
import React, { createContext, useContext } from 'react';
import { useMsal } from '@azure/msal-react';

interface IUserContext {
    userName: string;
}

const UserContext = createContext<IUserContext>({
    userName: 'Guest',
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { accounts } = useMsal();
    const userName = accounts.length > 0 ? accounts[0].username || 'Guest' : 'Guest';

    return (
        <UserContext.Provider value={{ userName }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);

export const useUsername = () => {
    const { userName } = useContext(UserContext);
    return userName;
};
