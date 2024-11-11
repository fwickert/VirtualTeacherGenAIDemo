import { useState, useEffect } from 'react';
import { Card, CardHeader, CardPreview } from '@fluentui/react-card';
import { Text } from '@fluentui/react-text';
import { AgentItem } from '../../models/AgentItem';
import { AgentDialog } from '../../components/admin/AgentDialog';

const Agent = () => {
    const [agents, setAgents] = useState<AgentItem[]>([]);        

    useEffect(() => {
        // Fetch agents from an API or data source
        fetch('/api/agent/byType?type=retail&withSystem=true')
            .then(response => response.json())
            .then(data => setAgents(data))
            .catch(error => console.error('Error fetching agents:', error));
    }, []);

    const addAgent = (newAgent: { name: string, description: string, prompt:string, type:string}) => {        
        setAgents([...agents, { id: "", ...newAgent }]);
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
                            <div>{agent.description}</div>
                            <div>{agent.prompt}</div>
                        </CardPreview>
                    </Card>
                ))}
            </div>
            <div className="add-agent-card">
                <AgentDialog onAddAgent={addAgent} />
            </div>
           
        </div>
    );
}

export default Agent;
