import { useState, useEffect } from 'react';
import { Card, CardHeader, CardPreview } from '@fluentui/react-card';
import { Text } from '@fluentui/react-text';
import { Button } from '@fluentui/react-button';
import { AgentItem } from '../../models/AgentItem';

const Agent = () => {
    const [agents, setAgents] = useState<AgentItem[]>([]);

    useEffect(() => {
        // Fetch agents from an API or data source
        fetch('/api/agent/retail')
            .then(response => response.json())
            .then(data => setAgents(data))
            .catch(error => console.error('Error fetching agents:', error));
    }, []);

    const addAgent = () => {
        // Logic to add a new agent
        console.log('Add new agent');
    };

    return (
        <div>
            <h1>Agent View</h1>           
            <div>
                {agents.map(agent => (
                    <Card key={agent.id} className="agent-card">
                        <CardHeader
                            header={<Text weight="semibold">{agent.name}</Text>}
                        />
                        <CardPreview>
                            <p>{agent.description}</p>
                        </CardPreview>
                    </Card>
                ))}
            </div>
            <div className="add-agent-card" onClick={addAgent}>
                <Button onClick={addAgent}>Add New Agent</Button>
            </div>
        </div>
    );
}

export default Agent;
