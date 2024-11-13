import { useState } from 'react';
import { AgentItem } from '../../models/AgentItem';
import { AgentDialog } from '../../components/agent/AgentDialog';
import AgentList from '../../components/agent/AgentList';


const Agent = () => {
    const [agents, setAgents] = useState<AgentItem[]>([]);
    const [dialogType, setDialogType] = useState<string | null>(null);

    const addAgent = (newAgent: AgentItem) => {
        setAgents([...agents, { ...newAgent }]);
    };

    return (
        <div>
            <h1>Agent View</h1>
            <AgentList  />
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
