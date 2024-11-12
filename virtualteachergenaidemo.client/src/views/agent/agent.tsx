import { useState } from 'react';
import { AgentItem } from '../../models/AgentItem';
import { AgentDialog } from '../../components/agent/AgentDialog';
import AgentList from '../../components/agent/AgentList';
import { mergeStyles } from '@fluentui/react';

const Agent = () => {
    const [agents, setAgents] = useState<AgentItem[]>([]);
    const [dialogType, setDialogType] = useState<string | null>(null);

    const addAgent = (newAgent: { name: string, description: string, prompt: string, type: string }) => {
        setAgents([...agents, { id: "", ...newAgent }]);
    };


    const handleAddAgent = (type: string) => {
        setDialogType(type);
    };

    const containerClass = mergeStyles({
        marginLeft: '100px',
        marginRight: '50px',
        width: '100%',

    });

    return (
        <div className={containerClass}>
            <h1>Agent View</h1>
            <AgentList onAddAgent={handleAddAgent} />
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
