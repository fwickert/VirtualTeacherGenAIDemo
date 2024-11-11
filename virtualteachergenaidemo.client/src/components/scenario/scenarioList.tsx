import { useState, useEffect } from 'react';
import { Card, CardHeader, CardPreview, CardFooter } from '@fluentui/react-card';
import { Text } from '@fluentui/react-text';
import { ScenarioItem } from '../../models/ScenarioItem';
import { Button } from '@fluentui/react-button';
import ScenarioDialog from './scenarioDialog';
import ChatWindow from '../chat/chatWindow';

interface ScenarioListProps {
    onScenarioSelect?: (scenario: ScenarioItem) => void;
}

const ScenarioList: React.FC<ScenarioListProps> = () => {
    const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
    const [selectedScenario, setSelectedScenario] = useState<ScenarioItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        // Fetch scenarios from an API or data source
        fetch('/api/scenario')
            .then(response => response.json())
            .then(data => setScenarios(data))
            .catch(error => console.error('Error fetching scenarios:', error));
    }, []);

    const handleDetailClick = (scenario: ScenarioItem) => {
        setSelectedScenario(scenario);
        setIsDialogOpen(true);
    };

    const handleStartClick = async (scenario: ScenarioItem) => {
        try {
            const response = await fetch(`/api/scenario/${scenario.id}`);
            const scenarioDetails = await response.json();
            setSelectedScenario(scenarioDetails);
            setIsChatOpen(true);
        } catch (error) {
            console.error('Error fetching scenario details:', error);
        }
    };

    return (
        <div>
            {!isChatOpen && (
                <div>
                    {scenarios.map(scenario => (
                        <Card key={scenario.id} className="scenario-card">
                            <CardHeader
                                header={<Text weight="semibold">{scenario.name}</Text>}
                            />
                            <CardPreview>
                                <div>{scenario.description}</div>
                            </CardPreview>
                            <CardFooter>
                                <Button onClick={() => handleDetailClick(scenario)}>Details</Button>
                                <Button onClick={() => handleStartClick(scenario)}>Start</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            {isDialogOpen && (
                <ScenarioDialog
                    isOpen={isDialogOpen}
                    scenario={selectedScenario}
                    onAddScenario={() => { }}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
            {isChatOpen && selectedScenario && (
                <ChatWindow scenario={selectedScenario} />
            )}
        </div>
    );
};

export default ScenarioList;
