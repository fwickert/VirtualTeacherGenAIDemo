import { useState, useEffect } from 'react';
import { Card, CardHeader, CardPreview } from '@fluentui/react-card';
import { Text } from '@fluentui/react-text';
import { ScenarioItem } from '../../models/ScenarioItem';
import ScenarioDialog from '../../components/admin/scenarioDialog';

const Scenario = () => {
    const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);

    useEffect(() => {
        // Fetch scenarios from an API or data source
        fetch('/api/scenario')
            .then(response => response.json())
            .then(data => setScenarios(data))
            .catch(error => console.error('Error fetching scenarios:', error));
    }, []);

    const addScenario = (newScenario: { name: string, description: string }) => {
        setScenarios([...scenarios, { id: "", ...newScenario }]);
    };

    return (
        <div>
            <h1>Scenario View</h1>
            <div>
                {scenarios.map(scenario => (
                    <Card key={scenario.id} className="scenario-card">
                        <CardHeader
                            header={<Text weight="semibold">{scenario.name}</Text>}
                        />
                        <CardPreview>
                            <div>{scenario.description}</div>
                        </CardPreview>
                    </Card>
                ))}
            </div>
            <div className="add-scenario-card">
                <ScenarioDialog onAddScenario={addScenario} />
            </div>
        </div>
    );
}

export default Scenario;
