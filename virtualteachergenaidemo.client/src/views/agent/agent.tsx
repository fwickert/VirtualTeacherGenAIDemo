import { useState } from 'react';
import { AgentItem } from '../../models/AgentItem';
import { AgentDialog } from '../../components/agent/AgentDialog';
import AgentList from '../../components/agent/AgentList';
import { mergeStyles } from '@fluentui/react';
import { Button } from '@fluentui/react-button';
import { useNavigate } from 'react-router-dom';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';


const Agent = () => {
    const [agents, setAgents] = useState<AgentItem[]>([]);
    const [dialogType, setDialogType] = useState<string | null>(null);
    const navigate = useNavigate();

    const addAgent = (newAgent: AgentItem) => {
        setAgents([...agents, { ...newAgent }]);
    };

    const handleBackClick = () => {
        navigate('/');
    };

    const containerClass = mergeStyles({
        marginLeft: '100px',
        marginRight: '50px',
        width: '90%',
    });

    return (
        <div className={containerClass}>
            <div className="header">
                <section className="intro">
                    <div className="back">
                        <Button size="large" appearance="transparent" onClick={handleBackClick} icon={<ArrowCircleLeft48Filled />} />
                    </div>
                    <h1>Agent View</h1>
                    <p className="intro">
                        An agent is part of the AI system and functions like an expert system. Users can see three types of agents: Roleplay that AI plays, Teacher, and System prompt.
                    </p>
                </section>
            </div>
            
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
