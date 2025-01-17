import './scenarioList.css';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardPreview, CardFooter } from '@fluentui/react-card';
import { Text, Title2, Body2 } from '@fluentui/react-text';
import { ScenarioItem } from '../../models/ScenarioItem';
import { Button } from '@fluentui/react-button';
import ScenarioDialog from './scenarioDialog';
import { Spinner } from '@fluentui/react-spinner';
import { makeStyles } from '@fluentui/react-components';
import { PersonAvailableFilled, AddCircleRegular, EditRegular, PlayRegular } from '@fluentui/react-icons';
import { mergeClasses } from '@fluentui/react-components';
import { tokens } from '@fluentui/tokens';
import { useUserRole } from '../../auth/UserRoleContext';
import { UserRoleEnum } from '../../models/UserRoleEnum';
import { useLocalization } from '../../contexts/LocalizationContext';
import { ScenarioService } from '../../services/ScenarioService';


interface ScenarioListProps {
    onScenarioSelect?: (scenario: ScenarioItem) => void;
    onScenarioStart?: (scenario: ScenarioItem) => void;
}

const useStyles = makeStyles({
    customPreview: {
        padding: '10px',
    },
    customCard: {
        minWidth: '400px',
        maxWidth: '300px',
        minHeight: '260px',
        maxHeight: '260px',
    },
    customCardSmall: {
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
        marginTop: '5px',
    },
    icon: {
        fontSize: '30px',
    },
    iconText: {
        marginTop: '0px',
        textAlign: 'center',
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
        zIndex: 1,
    },
    headerText: {
        fontSize: '20px',
    },
    description: {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: '3em', // Adjust based on line height to ensure consistent height
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

const ScenarioList: React.FC<ScenarioListProps> = ({ onScenarioStart }) => {
    const classes = useStyles();
    const { role } = useUserRole();
    const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
    const [selectedScenario, setSelectedScenario] = useState<ScenarioItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);    
    const { getTranslation } = useLocalization();

    useEffect(() => {
        ScenarioService.getAllScenarios()
            .then(response => {
                setScenarios(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching scenarios:', error);
                setIsLoading(false);
            });
    }, []);

    const handleStartClick = async (scenario: ScenarioItem) => {
        try {
            setIsLoading(true);
            setSelectedScenario(scenario);

            if (onScenarioStart) {
                onScenarioStart(scenario);
            }
        } catch (error) {
            console.error('Error fetching scenario details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const areAllAgentsSet = (scenario: ScenarioItem) => {
        return scenario.agents.length === 3;
    };

    const handleAddScenario = () => {
        setSelectedScenario(null);
        setIsDialogOpen(true);
    };

    const handleEditScenario = (scenario: ScenarioItem) => {
        setSelectedScenario(scenario);
        setIsDialogOpen(true);
    };

    const handleScenarioAddedOrEdited = (scenario: ScenarioItem) => {
        setScenarios((prevScenarios) => {
            const existingScenarioIndex = prevScenarios.findIndex((s) => s.id === scenario.id);
            if (existingScenarioIndex !== -1) {
                // Update existing scenario
                const updatedScenarios = [...prevScenarios];
                updatedScenarios[existingScenarioIndex] = scenario;

                return updatedScenarios;
            } else {
                // Add new scenario
                return [...prevScenarios, scenario];
            }
        });
        setIsDialogOpen(false);
        setSelectedScenario(null);
    };

    const handleDeleteScenario = (scenarioId: string) => {
        setScenarios(prevScenarios => prevScenarios.filter(scenario => scenario.id !== scenarioId));
    };

    return (
        <div className={classes.centerContainer}>
            {isLoading && <Spinner label={getTranslation("Loading")} />}
            {!isLoading && (
                <div className="scenario-cards-grid">
                    {role === UserRoleEnum.Admin && (
                        <Button className={classes.buttonWithIcon} onClick={handleAddScenario}>
                            <AddCircleRegular className={classes.buttonIcon} />
                            {getTranslation("NewScenario")}
                        </Button>
                    )}
                    {scenarios.map(scenario => (
                        <Card key={scenario.id} className={`${role === UserRoleEnum.Admin ? classes.customCard : classes.customCardSmall} card`}>
                            <CardHeader
                                header={<Title2 className={classes.headerText}>{scenario.name}</Title2>}
                            />
                            <CardPreview className={classes.customPreview}>
                                <div className={classes.iconGrid}>
                                    <div className={classes.description}><Body2>{scenario.description}</Body2></div>
                                    {role === UserRoleEnum.Admin && (
                                        <div className={classes.iconGrid}>
                                            {[0, 1, 2].map(index => {
                                                const agent = scenario.agents[index];
                                                const colorClass = agent ? getAgentColorClass(agent.type, classes) : classes.grayColor;
                                                return (
                                                    <div key={index} className={classes.iconItem}>
                                                        <PersonAvailableFilled className={mergeClasses(classes.icon, colorClass)} />
                                                        <Text className={mergeClasses(classes.iconText, colorClass)}>
                                                            {agent ? agent.name.split(' ').slice(0, 3).join(' ') + (agent.name.split(' ').length > 3 ? '...' : '') : getTranslation("NoSet")}
                                                        </Text>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </CardPreview>

                            <CardFooter>

                                {role === UserRoleEnum.Admin && (
                                    <Button
                                        icon={<EditRegular />}
                                        className={classes.editButton}
                                        onClick={() => handleEditScenario(scenario)}>
                                        {getTranslation("Edit")}
                                    </Button>
                                )}
                                <Button
                                    appearance='primary'
                                    icon={<PlayRegular />}
                                    onClick={() => handleStartClick(scenario)}
                                    disabled={!areAllAgentsSet(scenario)}>{getTranslation("Start")}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            {isDialogOpen && (
                <ScenarioDialog
                    isOpen={isDialogOpen}
                    scenario={selectedScenario}
                    onAddScenario={handleScenarioAddedOrEdited}
                    onDeleteScenario={handleDeleteScenario}
                    onClose={() => setIsDialogOpen(false)}
                />
            )}
        </div>
    );
};

export default ScenarioList;
