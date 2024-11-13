import { useState } from 'react';
import { ScenarioItem, Agent } from '../../models/ScenarioItem';
import ScenarioDialog from '../../components/scenario/scenarioDialog';
import ScenarioList from '../../components/scenario/scenarioList';
import { mergeStyles } from '@fluentui/react';

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


    const containerClass = mergeStyles({
        marginLeft: '100px',
        marginRight: '50px',
        width: '100%',


    });

    return (
        <div className={containerClass}>
            <h1>{title}</h1>


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
