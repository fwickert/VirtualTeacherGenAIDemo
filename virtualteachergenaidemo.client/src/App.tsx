import React, { useEffect, useState } from 'react';
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
                <AuthenticatedApp title={props.title} />
            </UserProvider>
        </MsalProvider>
    );
}

function AuthenticatedApp(props: any) {
    const { accounts } = useMsal();
    const userName = accounts.length > 0 ? accounts[0].name : 'Guest';

    console.log('AuthenticatedApp rendered with userName:', userName);

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
                    <Route path="/scenarios" element={<Scenario title="Scenarios List" isForSimulation={false} />} />
                </Routes>
            </MsalAuthenticationTemplate>
        </Router>
    );
}

export default App;
