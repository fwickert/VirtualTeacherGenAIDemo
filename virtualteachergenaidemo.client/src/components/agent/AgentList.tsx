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

interface AgentListProps {
    onAgentStart: () => void;
    onAddAgent: (type: string) => void;
}

const useStyles = makeStyles({
    customPreview: {
        padding: '10px',
    },
    customCard: {
        minWidth: '400px',
        maxWidth: '300px',
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

const AgentList: FC<AgentListProps> = ({ onAddAgent }) => {
    const classes = useStyles();
    const [agents, setAgents] = useState<AgentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('RolePlay');
    const [editingAgent, setEditingAgent] = useState<AgentItem | null>(null);

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

    const renderAgents = (filter: string) => {
        return agents
            .filter(agent => agent.type === filter)
            .map(agent => (
                <Card key={agent.id} className={`${classes.customCard} card`} >
                    <CardHeader
                        header={<Title2>{agent.name}</Title2>}
                    />
                    <CardPreview className={classes.customPreview}>
                        <div className={classes.iconGrid}>
                            <div><Body2>{agent.description}</Body2></div>
                            <div className={classes.iconGrid}>
                                <div className={classes.iconItem}>
                                    <PersonAvailableFilled
                                        className={mergeClasses(classes.icon, getAgentColorClass(agent.type, classes))}
                                    />
                                    <Text className={mergeClasses(classes.iconText, getAgentColorClass(agent.type, classes))}>
                                        {agent.name}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </CardPreview>
                    <CardFooter>
                        <Button
                            icon={<EditRegular />}
                            className={classes.editButton}
                            onClick={() => setEditingAgent(agent)}>
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
        <div>
            <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
                <Tab value="RolePlay">RolePlay</Tab>
                <Tab value="Teacher">Teacher</Tab>
                <Tab value="System">System</Tab>
            </TabList>
            <div className="agent-cards-grid">
                {selectedTab === 'RolePlay' && (
                    <>
                        <Button className={classes.buttonWithIcon} onClick={() => onAddAgent('retail')}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            Add Roleplay Agent
                        </Button>
                        {renderAgents('retail')}
                    </>
                )}
                {selectedTab === 'Teacher' && (
                    <>
                        <Button className={classes.buttonWithIcon} onClick={() => onAddAgent('teacher')}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            Add Teacher Agent
                        </Button>
                        {renderAgents('teacher')}
                    </>
                )}
                {selectedTab === 'System' && (
                    <>
                        <Button className={classes.buttonWithIcon} onClick={() => onAddAgent('system')}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            Add System Agent
                        </Button>
                        {renderAgents('system')}
                    </>
                )}
            </div>
            {editingAgent && (
                <AgentDialog
                    onAddAgent={(agent) => {
                        setAgents((prevAgents) =>
                            prevAgents.map((a) => (a.id === editingAgent.id ? { ...a, ...agent } : a))
                        );
                        setEditingAgent(null);
                    }}
                    type={editingAgent.type}
                    onClose={() => setEditingAgent(null)}
                    agent={editingAgent}
                />
            )}
        </div>
    );
}

export default AgentList;
