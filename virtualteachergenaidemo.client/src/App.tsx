import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/home';
import LastTraining from './views/trainingList/lastTraining';
import Dashboard from './views/dashboard/dashboard';
import Coach from './views/coach/coach';
import Agent from './views/agent/agent';
import Scenario from './views/scenario/scenario';
import Training from './views/training/training';
import Session from './views/session/session';
import { MsalProvider, MsalAuthenticationTemplate, useMsal } from '@azure/msal-react';
import { initializeMsal } from './auth/msalConfig';
import { PublicClientApplication } from '@azure/msal-browser';
import { InteractionType } from '@azure/msal-browser';
import UserDisplay from './auth/userDisplay';
import { UserProvider } from './auth/UserContext';
import { UserRoleProvider, useUserRole } from './auth/UserRoleContext';
import { getUserRole, createUser } from './services/UserService';
import { LocalizationProvider, useLocalization } from './contexts/LocalizationContext';

function App(props: any) {
    const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);
    

    useEffect(() => {
        const initMsal = async () => {
            const instance = await initializeMsal();
            setMsalInstance(instance);
        };

        initMsal();
    }, []);

    if (!msalInstance) {
        return <div>Loading...</div>;
    }

    return (
        <MsalProvider instance={msalInstance}>
            <UserProvider>
                <UserRoleProvider>
                    <LocalizationProvider lang="fr-FR">
                        <AuthenticatedApp title={props.title} />
                    </LocalizationProvider>
                </UserRoleProvider>
            </UserProvider>
        </MsalProvider>
    );
}

function AuthenticatedApp(props: any) {
    const { accounts } = useMsal();
    const userName = accounts.length > 0 ? accounts[0].name : 'Guest';
    const email = accounts.length > 0 ? accounts[0].username : 'Guest';
    const { setRole } = useUserRole();
    const { getTranslation } = useLocalization();

    useEffect(() => {
        const fetchUserRole = async () => {
            if (email) {
                try {
                    let userData = await getUserRole(email);
                    if (!userData) {
                        userData = await createUser(email);
                    }
                    setRole(userData.role);
                } catch (error) {
                    console.error('Error fetching or creating user:', error);
                }
            }
        };

        fetchUserRole();
    }, [email, setRole]);

    return (
        <Router>
            <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
                <UserDisplay userName={userName} />
                <Routes>
                    <Route path="/" element={<Home title={props.title} />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/session" element={<Session />} />
                    <Route path="/lastTraining" element={<LastTraining />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/coach" element={<Coach />} />
                    <Route path="/agent" element={<Agent />} />
                    <Route path="/scenarios" element={<Scenario title={getTranslation("ScenarioTitle") } isForSimulation={false} />} />
                </Routes>
            </MsalAuthenticationTemplate>
        </Router>
    );
}

export default App;
