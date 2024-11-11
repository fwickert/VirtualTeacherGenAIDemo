import { useState, useEffect } from 'react';
import { Card, CardHeader, CardPreview } from '@fluentui/react-card';
import { Text } from '@fluentui/react-text';
import { AgentItem } from '../../models/AgentItem';
import { AgentDialog } from '../../components/admin/AgentDialog';
import { Button } from '@fluentui/react-button';

const Agent = () => {
    const [agents, setAgents] = useState<AgentItem[]>([]);
    const [dialogType, setDialogType] = useState<string | null>(null);

    useEffect(() => {
        // Fetch agents from an API or data source
        fetch('/api/agent/byType?type=retail&withSystem=true')
            .then(response => response.json())
            .then(data => setAgents(data))
            .catch(error => console.error('Error fetching agents:', error));
    }, []);

    const addAgent = (newAgent: { name: string, description: string, prompt: string, type: string }) => {
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
            <div className="add-agent-buttons">
                <Button appearance="primary" onClick={() => setDialogType('system')}>Add System Agent</Button>
                <Button appearance="primary" onClick={() => setDialogType('retail')}>Add Roleplay Agent</Button>
                <Button appearance="primary" onClick={() => setDialogType('teacher')}>Add Teacher Agent</Button>
            </div>
            {dialogType && (
                <AgentDialog
                    onAddAgent={addAgent}
                    type={dialogType}
                    onClose={() => setDialogType(null)}
                />
            )}
        </div>
    );
}

export default Agent;
