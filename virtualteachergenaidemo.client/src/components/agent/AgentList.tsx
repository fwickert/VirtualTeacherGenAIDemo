import './agentList.css';
import { useState, useEffect, FC } from 'react';
import { Card, CardHeader, CardPreview, CardFooter } from '@fluentui/react-card';
import { Title2, Body2 } from '@fluentui/react-text';
import { Spinner } from '@fluentui/react';
import { Tab, TabList } from '@fluentui/react-tabs';
import { AgentItem } from '../../models/AgentItem';
import { makeStyles } from '@fluentui/react-components';
import { PersonAvailableFilled, AddCircleRegular, EditRegular } from '@fluentui/react-icons';
import { mergeClasses } from '@fluentui/react-components';
import { tokens } from '@fluentui/tokens';
import { Button } from '@fluentui/react-button';
import { AgentDialog } from './AgentDialog';
import { useLocalization } from '../../contexts/LocalizationContext';
import { AgentService } from '../../services/AgentService';

const useStyles = makeStyles({
    customPreview: {
        padding: '5px',
    },
    customCard: {
        minWidth: '400px',
        maxWidth: '300px',
        minHeight: '200px',
        maxHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: 'auto',
    },
    editButton: {
        marginLeft: 'auto',
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
        zIndex: 1,
    },
    buttonIcon: {
        fontSize: '48px',
        marginBottom: '5px',
    },
    headerText: {
        fontSize: '20px',
        lineHeight: 'var(--lineHeightBase400)',
    },
    truncatedText: {
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
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
    const { getTranslation } = useLocalization();

    useEffect(() => {        
        AgentService.getAllAgents()
            .then(response => {
                setAgents(response.data);
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
                        header={<Title2 className={classes.headerText}>{agent.name}</Title2>}
                        action={<PersonAvailableFilled className={mergeClasses(classes.icon, getAgentColorClass(agent.type, classes))} />}
                    />
                    <CardPreview className={classes.customPreview}>
                        <div><Body2 className={classes.truncatedText}>{agent.description}</Body2></div>
                    </CardPreview>
                    <CardFooter className={classes.cardFooter}>
                        <Button
                            icon={<EditRegular />}
                            className={classes.editButton}
                            onClick={() => {
                                setEditingAgent(agent);
                                setDialogType(agent.type);
                                setIsDialogOpen(true);
                            }}>
                            {getTranslation("Edit")}
                        </Button>
                    </CardFooter>
                </Card>
            ));
    };

    if (loading) {
        return <Spinner label={getTranslation("Loading")} />;
    }

    return (
        <div className="tabcontainer">
            <TabList selectedValue={selectedTab} onTabSelect={onTabSelect} appearance='subtle-circular' size='large'>
                <Tab value="RolePlay" icon={<PersonAvailableFilled className={mergeClasses(classes.icon, getAgentColorClass('rolePlay', classes))} />}>{getTranslation("RolePlayTabLabel")}</Tab>
                <Tab value="Teacher" icon={<PersonAvailableFilled className={mergeClasses(classes.icon, getAgentColorClass("teacher", classes))} />}>{getTranslation("TeacherTabLabel")}</Tab>
                <Tab value="System" icon={<PersonAvailableFilled className={mergeClasses(classes.icon, getAgentColorClass("system", classes))} />}>{getTranslation("SystemTabLabel")}</Tab>
            </TabList>
            <div className="agent-cards-grid">
                {selectedTab === 'RolePlay' && (
                    <>
                        <Button className={classes.buttonWithIcon} onClick={() => handleAddAgent('rolePlay')}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            {getTranslation("AddAgentButton")}
                        </Button>
                        {renderAgents('rolePlay')}
                    </>
                )}
                {selectedTab === 'Teacher' && (
                    <>
                        <Button className={classes.buttonWithIcon} onClick={() => handleAddAgent('teacher')}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            {getTranslation("AddAgentButton")}
                        </Button>
                        {renderAgents('teacher')}
                    </>
                )}
                {selectedTab === 'System' && (
                    <>
                        <Button className={classes.buttonWithIcon} onClick={() => handleAddAgent('system')}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            {getTranslation("AddAgentButton")}
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
