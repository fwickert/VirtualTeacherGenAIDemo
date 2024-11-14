import './training.css'
import { Text } from "@fluentui/react-text"
import { useNavigate, useLocation } from 'react-router-dom';
import ChatWindow from '../../components/chat/chatWindow'
import { Button } from '@fluentui/react-button';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { useState, useEffect } from 'react';
import ScenarioList from '../../components/scenario/scenarioList';
import { ScenarioItem } from '../../models/ScenarioItem';
import { SessionItem } from '../../models/SessionItem';
import { Session } from 'inspector';

function Training() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedScenario, setSelectedScenario] = useState<ScenarioItem | undefined>(location.state?.scenario);
    const [session, setSession] = useState<SessionItem | undefined>();

    const handleBackClick = () => {
        setSelectedScenario(undefined);
        setSession(undefined);
        navigate(-1); // Navigate back to the previous page
    };

    const handleScenarioSelect = (scenario: ScenarioItem) => {
        setSelectedScenario(scenario);
    };

    useEffect(() => {        
        if (location.state?.scenario) {
            setSelectedScenario(location.state.scenario);
        } else {
            setSession(location.state.session);
        
        }
    }, [location.state]);


    return (
        <div>
            <Text align="center">
                <section className="intro">
                    <div className="back">
                        <Button size="large" appearance="transparent" onClick={handleBackClick} icon={<ArrowCircleLeft48Filled />} />
                    </div>
                    <h1 className="title">Virtual Assistant Teacher</h1>
                    <p className="intro">
                        Virtual Assistant Teacher is a tool that trains you to sell with an AI customer.<br /> It simulates a real scenario, listens and evaluates you, and gives you feedback and tips. It helps you to boost your confidence and efficiency in sales.
                    </p>

                    {!selectedScenario && !session && <ScenarioList onScenarioSelect={handleScenarioSelect} />}
                </section>
            </Text>

            <>
                {console.log("Passing sessionId to ChatWindow: ", session?.id)}
                {(selectedScenario || session) && <ChatWindow scenario={selectedScenario} session={session} />}
            </>
        </div>
    );
};

export default Training;
