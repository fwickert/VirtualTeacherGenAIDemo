import { Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-dialog';
import { Button } from '@fluentui/react-button';
import { Card, CardHeader, CardPreview } from '@fluentui/react-card';
import { useState, useEffect } from 'react';
import { Agent } from '../../models/ScenarioItem';
import { useLocalization } from '../../contexts/LocalizationContext';
import { AgentService } from '../../services/AgentService';

interface AgentSelectionDialogProps {
    onSelectAgent: (agent: Agent) => void;
    onClose: () => void;
    isOpen: boolean;
    type: 'system' | 'rolePlay' | 'teacher';
}

export const AgentSelectionDialog = ({ onSelectAgent, onClose, isOpen, type }: AgentSelectionDialogProps) => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const { getTranslation } = useLocalization();

    useEffect(() => {
        AgentService.getAgentsByType(type)
            .then(response => setAgents(response.data))
            .catch(error => console.error('Error:', error));
    }, [type]);

    return (
        <Dialog open={isOpen} onOpenChange={(_event, data) => !data.open && onClose()}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{getTranslation("Select")} {type.charAt(0).toUpperCase() + type.slice(1)} {getTranslation("Agent")}</DialogTitle>
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
                        <Button appearance="secondary" onClick={onClose}>{getTranslation("CancelButton")}</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default AgentSelectionDialog;
