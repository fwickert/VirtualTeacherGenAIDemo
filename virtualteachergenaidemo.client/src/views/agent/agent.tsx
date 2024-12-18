import { useEffect, useState } from 'react';
import { AgentItem } from '../../models/AgentItem';
import { AgentDialog } from '../../components/agent/AgentDialog';
import AgentList from '../../components/agent/AgentList';
import { mergeStyles } from '@fluentui/react';
import { Button } from '@fluentui/react-button';
import { useNavigate } from 'react-router-dom';
import { ArrowCircleLeft48Filled } from '@fluentui/react-icons';
import { useUserRole } from '../../auth/UserRoleContext';
import { UserRoleEnum } from '../../models/UserRoleEnum';
import { useLocalization } from '../../contexts/LocalizationContext';


const Agent = () => {
    const [agents, setAgents] = useState<AgentItem[]>([]);
    const [dialogType, setDialogType] = useState<string | null>(null);
    const navigate = useNavigate();
    const { role } = useUserRole();
    const { getTranslation } = useLocalization();

    useEffect(() => {
        if (role !== UserRoleEnum.Admin) {
            navigate('/');
        }
    }, [role, navigate]);

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
                    <h1>{getTranslation("ViewAgentTitle")}</h1>
                    <p className="intro">                        
                        {getTranslation("ViewAgentDescription")}
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
