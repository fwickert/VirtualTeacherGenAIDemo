import './training.css'
import { Text } from "@fluentui/react-text"
import { useNavigate } from 'react-router-dom';
import ChatWindow from '../../components/chat/chatWindow'
import { Button } from '@fluentui/react-button';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { useState } from 'react';
import ScenarioList from '../../components/scenario/scenarioList';
import { ScenarioItem } from '../../models/ScenarioItem';

function Training() {
    
    const navigate = useNavigate();
    const [selectedScenario, setSelectedScenario] = useState<ScenarioItem | undefined>(undefined);

    const handleBackClick = () => {
        navigate('/');
    };

    const handleScenarioSelect = (scenario: ScenarioItem) => {
        setSelectedScenario(scenario);
    };

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
                    <ScenarioList onScenarioSelect={handleScenarioSelect} />
                </section>
            </Text>

            {selectedScenario && <ChatWindow scenario={selectedScenario.id} />}

            
            
        </div>
    );
};

export default Training;