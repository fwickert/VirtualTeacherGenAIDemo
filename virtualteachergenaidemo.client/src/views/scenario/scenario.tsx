import { useState } from 'react';
import { ScenarioItem, Agent } from '../../models/ScenarioItem';
import ScenarioDialog from '../../components/scenario/scenarioDialog';
import ScenarioList from '../../components/scenario/scenarioList';
import { Button } from '@fluentui/react-button';
import { mergeStyles } from '@fluentui/react';

interface ScenarioProps {
    title: string;
    isForSimulation: boolean;
}

const Scenario = ({ title }: ScenarioProps) => {
    const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isButtonHidden, setIsButtonHidden] = useState(false);

    const addScenario = (newScenario: { name: string, description: string, agents: Agent[] }) => {
        setScenarios([...scenarios, { id: "", ...newScenario }]);
    };

    const handleStartScenario = () => {
        setIsButtonHidden(true);
    };

    const containerClass = mergeStyles({
        marginLeft: '100px',
        marginRight: '50px',
        width: '100%'
        
    });

    return (
        <div className={containerClass}>
            <h1>{title}</h1>
            {!isButtonHidden && <Button onClick={() => setIsDialogOpen(true)}>New Scenario</Button>}
            <ScenarioList onScenarioStart={handleStartScenario} />
            <ScenarioDialog
                isOpen={isDialogOpen}
                onAddScenario={addScenario}
                onClose={() => setIsDialogOpen(false)}
            />
        </div>
    );
}

export default Scenario;
