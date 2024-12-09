import './agentList.css';
import { useState, useEffect, FC } from 'react';
import { Card, CardHeader, CardPreview, CardFooter } from '@fluentui/react-card';
import { Text, Title2, Body2 } from '@fluentui/react-text';
import { Spinner } from '@fluentui/react';
import { Tab, TabList } from '@fluentui/react-tabs';
import { AgentItem } from '../../models/AgentItem';
import { makeStyles } from '@fluentui/react-components';
import { PersonAvailableFilled, AddCircleRegular, EditRegular } from '@fluentui/react-icons';
import { mergeClasses } from '@fluentui/react-components';
import { tokens } from '@fluentui/tokens';
import { Button } from '@fluentui/react-button';
import { AgentDialog } from './AgentDialog'; // Import AgentDialog

const useStyles = makeStyles({
    customPreview: {
        padding: '10px',
    },
    customCard: {
        minWidth: '400px',
        maxWidth: '300px',
        minHeight: '200px',
        maxHeight: '200px',
    },
    iconGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '10px',
    },
    iconItem: {
        display: 'grid',
        justifyItems: 'center',
        alignItems: 'center',
        marginTop: '20px',
    },
    icon: {
        fontSize: '40px',
    },
    iconText: {
        marginTop: '5px',
    },
    grayColor: {
        color: tokens.colorNeutralForegroundDisabled,
    },
    systemColor: {
        color: tokens.colorPaletteLilacForeground2,
    },
    teacherColor: {
        color: tokens.colorPaletteLightGreenForeground1,
    },
    otherColor: {
        color: tokens.colorBrandForeground1,
    },
    centerContainer: {
        display: 'flex',
        justifyContent: 'left',
        marginTop: '10px',
    },
    buttonWithIcon: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonIcon: {
        fontSize: '48px',
        marginBottom: '5px',
    },
    editButton: {
        marginLeft: 'auto',
    },
});

const getAgentColorClass = (agentType: string, classes: any) => {
    switch (agentType) {
        case 'system':
            return classes.systemColor;
        case 'teacher':
            return classes.teacherColor;
        default:
            return classes.otherColor;
    }
};

const AgentList: FC = () => {
    const classes = useStyles();
    const [agents, setAgents] = useState<AgentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('RolePlay');
    const [editingAgent, setEditingAgent] = useState<AgentItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<string>('');

    useEffect(() => {
        // Fetch agents from an API or data source
        fetch('/api/agent/all')
            .then(response => response.json())
            .then(data => {
                setAgents(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching agents:', error);
                setLoading(false);
            });
    }, []);

    const onTabSelect = (_event: any, data: any) => {
        setSelectedTab(data.value);
    };

    const handleAddAgent = (type: string) => {
        setDialogType(type);
        setEditingAgent(null);
        setIsDialogOpen(true);
    };

    const handleAgentAddedOrEdited = (agent: AgentItem) => {
        setAgents((prevAgents) => {
            const existingAgentIndex = prevAgents.findIndex((a) => a.id === agent.id);
            if (existingAgentIndex !== -1) {
                // Update existing agent
                const updatedAgents = [...prevAgents];
                updatedAgents[existingAgentIndex] = agent;

                return updatedAgents;
            } else {
                // Add new agent
                return [...prevAgents, agent];
            }
        });
        setIsDialogOpen(false);
        setEditingAgent(null);
    };

    const handleDeleteAgent = (agentId: string) => {
        setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
    };


    const renderAgents = (filter: string) => {
        return agents
            .filter(agent => agent.type === filter)
            .map(agent => (
                <Card key={agent.id} className={`${classes.customCard} card`} >
                    <CardHeader
                        header={<Title2>{agent.name}</Title2>}
                        action={<PersonAvailableFilled className={mergeClasses(classes.icon, getAgentColorClass(agent.type, classes))} />}
                    />
                    <CardPreview className={classes.customPreview}>
                        <div className={classes.iconGrid}>
                            <div><Body2>{agent.description}</Body2></div>                            
                        </div>
                    </CardPreview>
                    <CardFooter>
                        <Button
                            icon={<EditRegular />}
                            className={classes.editButton}
                            onClick={() => {
                                setEditingAgent(agent);
                                setDialogType(agent.type);
                                setIsDialogOpen(true);
                            }}>
                            Edit
                        </Button>
                    </CardFooter>
                </Card>
            ));
    };

    if (loading) {
        return <Spinner label="Loading agents..." />;
    }

    return (
        <div className="tabcontainer">
            <TabList selectedValue={selectedTab} onTabSelect={onTabSelect} appearance='subtle-circular' size='large'>
                <Tab value="RolePlay" icon={<PersonAvailableFilled className={mergeClasses(classes.icon, getAgentColorClass('rolePlay', classes))} />}>RolePlay</Tab>
                <Tab value="Teacher" icon={<PersonAvailableFilled className={mergeClasses(classes.icon, getAgentColorClass("teacher", classes))} />}>Teacher</Tab>
                <Tab value="System" icon={<PersonAvailableFilled className={mergeClasses(classes.icon, getAgentColorClass("system", classes))} />}>System</Tab>
            </TabList>
            <div className="agent-cards-grid">
                {selectedTab === 'RolePlay' && (
                    <>
                        <Button className={classes.buttonWithIcon} onClick={() => handleAddAgent('rolePlay')}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            Add Roleplay Agent
                        </Button>
                        {renderAgents('rolePlay')}
                    </>
                )}
                {selectedTab === 'Teacher' && (
                    <>
                        <Button className={classes.buttonWithIcon} onClick={() => handleAddAgent('teacher')}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            Add Teacher Agent
                        </Button>
                        {renderAgents('teacher')}
                    </>
                )}
                {selectedTab === 'System' && (
                    <>
                        <Button className={classes.buttonWithIcon} onClick={() => handleAddAgent('system')}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            Add System Agent
                        </Button>
                        {renderAgents('system')}
                    </>
                )}
            </div>
            {isDialogOpen && (

                <AgentDialog
                    onAddAgent={handleAgentAddedOrEdited}
                    onDeleteAgent={handleDeleteAgent}
                    type={dialogType}
                    onClose={() => setIsDialogOpen(false)}
                    agent={editingAgent || undefined}
                />
            )}
        </div>
    );
}

export default AgentList;
