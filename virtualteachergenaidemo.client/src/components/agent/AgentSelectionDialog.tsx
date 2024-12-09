import { Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-dialog';
import { Button } from '@fluentui/react-button';
import { Card, CardHeader, CardPreview } from '@fluentui/react-card';
import { useState, useEffect } from 'react';
import { Agent } from '../../models/ScenarioItem';

interface AgentSelectionDialogProps {
    onSelectAgent: (agent: Agent) => void;
    onClose: () => void;
    isOpen: boolean;
    type: 'system' | 'rolePlay' | 'teacher';
}

export const AgentSelectionDialog = ({ onSelectAgent, onClose, isOpen, type }: AgentSelectionDialogProps) => {
    const [agents, setAgents] = useState<Agent[]>([]);

    useEffect(() => {
        // Fetch agents with the specified type from API
        fetch(`/api/agent/ByType?type=${type}`)
            .then(response => response.json())
            .then(data => setAgents(data))
            .catch(error => console.error('Error:', error));
    }, [type]);

    return (
        <Dialog open={isOpen} onOpenChange={(_event, data) => !data.open && onClose()}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Select {type.charAt(0).toUpperCase() + type.slice(1)} Agent</DialogTitle>
                    <DialogContent>
                        {agents.map(agent => (
                            <Card key={agent.id} onClick={() => onSelectAgent(agent)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
                                <CardHeader header={<h3>{agent.name}</h3>}>                                    
                                </CardHeader>
                                <CardPreview>                                    
                                    <p>{agent.prompt}</p>
                                </CardPreview>
                            </Card>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="secondary" onClick={onClose}>Cancel</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default AgentSelectionDialog;
