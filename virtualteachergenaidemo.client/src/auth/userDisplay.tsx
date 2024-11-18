import React from 'react';
import { Menu, MenuTrigger, MenuList, MenuItem, MenuPopover, Button } from '@fluentui/react-components';
import { useMsal } from '@azure/msal-react';

interface UserDisplayProps {
    userName: string | undefined;
}

const UserDisplay: React.FC<UserDisplayProps> = ({ userName }) => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutRedirect();
    };

    return (
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <Menu>
                <MenuTrigger>
                    <Button appearance="secondary">{userName}</Button>
                </MenuTrigger>
                <MenuPopover>
                    <MenuList>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
        </div>
    );
};

export default UserDisplay;
