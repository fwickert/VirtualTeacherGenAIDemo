import './training.css'
import { Text } from "@fluentui/react-text"
import { useNavigate, useLocation } from 'react-router-dom';
import Chat from '../../components/chat/chat'
import { Button } from '@fluentui/react-button';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { useState, useEffect } from 'react';
import ScenarioList from '../../components/scenario/scenarioList';
import { ScenarioItem } from '../../models/ScenarioItem';
import { SessionItem } from '../../models/SessionItem';
import { useLocalization } from '../../contexts/LocalizationContext';


function Training() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getTranslation } = useLocalization();
    const [selectedScenario, setSelectedScenario] = useState<ScenarioItem | null>(location.state?.scenario);
    const [session, setSession] = useState<SessionItem | null>();    

    const handleBackClick = () => {
        setSelectedScenario(null);
        setSession(null);
        navigate(-1); // Navigate back to the previous page
    };

    const handleScenarioSelect = async (scenario: ScenarioItem) => {
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
                    <h1 className="title">{getTranslation("VirtualAssistantTeacherTitle")}</h1>
                    <p className="intro">
                        {getTranslation("VirtualAssistantTeacherDescription")}
                    </p>

                    {!selectedScenario && !session && <ScenarioList onScenarioSelect={handleScenarioSelect} />}
                </section>
            </Text>

            {(selectedScenario || session) && <Chat scenario={selectedScenario} session={session!} />}
        </div>
    );
};

export default Training;
