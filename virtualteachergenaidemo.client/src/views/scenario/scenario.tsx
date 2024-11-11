import { useState } from 'react';
import { ScenarioItem, Agent } from '../../models/ScenarioItem';
import ScenarioDialog from '../../components/scenario/scenarioDialog';
import ScenarioList from '../../components/scenario/scenarioList';
import { Button } from '@fluentui/react-button';

interface ScenarioProps {
    title: string;
    isForSimulation: boolean;
}

const Scenario = ({ title }: ScenarioProps) => {
    const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addScenario = (newScenario: { name: string, description: string, agents: Agent[] }) => {
        setScenarios([...scenarios, { id: "", ...newScenario }]);
    };

    return (
        <div>
            <h1>{title}</h1>
            <Button onClick={() => setIsDialogOpen(true)}>New Scenario</Button>
            <ScenarioList />
            <ScenarioDialog
                isOpen={isDialogOpen}
                onAddScenario={addScenario}
                onClose={() => setIsDialogOpen(false)}
            />
        </div>
    );
}

export default Scenario;
