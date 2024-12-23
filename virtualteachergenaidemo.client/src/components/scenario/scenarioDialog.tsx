import './scenarioDialog.css';
import { Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-dialog';
import { Button } from '@fluentui/react-button';
import { Input } from '@fluentui/react-input';
import { Textarea } from '@fluentui/react-textarea';
import { Field } from '@fluentui/react-field';
import { useState, useEffect } from 'react';
import { Agent, ScenarioItem } from '../../models/ScenarioItem';
import { makeStyles } from '@fluentui/react-components';
import AgentSelectionDialog from '../agent/AgentSelectionDialog';
import { Add24Regular } from '@fluentui/react-icons';
import { tokens } from '@fluentui/tokens';
import { useLocalization } from '../../contexts/LocalizationContext';
import { ScenarioService } from '../../services/ScenarioService';

const useStyles = makeStyles({
    customDialogSurface: {
        width: '70%', // Set your desired width
        maxWidth: '90%', // Ensure it doesn't exceed the viewport width
    },
    dialogContent: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Two equal columns
        gap: '16px', // Space between columns
    },
    buttonGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr', // Three equal columns
        gap: '16px', // Space between columns
    },
    circularButton: {
        borderRadius: '10px',
        width: '50px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        minWidth: 0,
    },
    agentName: {
        marginLeft: '8px', // Space between button and text
    },
    deleteButton: {
        backgroundColor: tokens.colorPaletteRedBackground3,
        color: "white",
        ':hover': {
            backgroundColor: tokens.colorPaletteRedForeground1,
            color: 'white',
        },
    },
});

interface ScenarioDialogProps {
    onAddScenario: (scenario: ScenarioItem) => void;
    onDeleteScenario: (scenarioId: string) => void;
    onClose: () => void;
    isOpen: boolean;
    scenario?: ScenarioItem | null;
}

export const ScenarioDialog = ({ onAddScenario, onDeleteScenario, onClose, isOpen, scenario }: ScenarioDialogProps) => {
    const styles = useStyles();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [systemAgentError, setSystemAgentError] = useState('');
    const [rolePlayAgentError, setRolePlayAgentError] = useState('');
    const [teacherAgentError, setTeacherAgentError] = useState('');
    const [systemAgent, setSystemAgent] = useState<Agent | null>(null);
    const [rolePlayAgent, setRolePlayAgent] = useState<Agent | null>(null);
    const [teacherAgent, setTeacherAgent] = useState<Agent | null>(null);
    const [isAgentDialogOpen, setIsAgentDialogOpen] = useState<boolean>(false);
    const [agentType, setAgentType] = useState<'system' | 'rolePlay' | 'teacher'>('system');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
    const { getTranslation } = useLocalization();

    useEffect(() => {
        if (scenario) {
            setName(scenario.name);
            setDescription(scenario.description);
            // Assuming scenario.agents is an array of agents
            setSystemAgent(scenario.agents.find(agent => agent.type === 'system') || null);
            setRolePlayAgent(scenario.agents.find(agent => agent.type === 'rolePlay') || null);
            setTeacherAgent(scenario.agents.find(agent => agent.type === 'teacher') || null);
        }
    }, [scenario]);

    const handleAddScenario = () => {
        let valid = true;
        if (name.trim() === '') {
            setNameError(getTranslation("NameRequired"));
            valid = false;
        } else {
            setNameError('');
        }

        if (description.trim() === '') {
            setDescriptionError(getTranslation("DescriptionRequired"));
            valid = false;
        } else {
            setDescriptionError('');
        }

        if (!systemAgent) {
            setSystemAgentError(getTranslation("SystemAgentRequired"));
            valid = false;
        } else {
            setSystemAgentError('');
        }

        if (!rolePlayAgent) {
            setRolePlayAgentError(getTranslation("RolePlayAgentRequired"));
            valid = false;
        } else {
            setRolePlayAgentError('');
        }

        if (!teacherAgent) {
            setTeacherAgentError(getTranslation("TeacherAgentRequired"));
            valid = false;
        } else {
            setTeacherAgentError('');
        }

        if (!valid) return;

        const agents = [
            systemAgent,
            rolePlayAgent,
            teacherAgent
        ].filter(agent => agent !== null) as Agent[];

        const newScenario = { name, description, agents, id: scenario ? scenario.id : "" };

        const apiCall = scenario ? ScenarioService.updateScenario(newScenario) : ScenarioService.addScenario(newScenario);

        apiCall
            .then(response => {
                const data = response.data;
                console.log('Success:', data);
                if (!scenario) {
                    newScenario.id = data.id; // Assuming the API returns the new scenario's ID
                }
                onAddScenario(newScenario);
            })
            .catch(error => console.error('Error:', error));

        setIsAgentDialogOpen(false);
        onClose();
    };

    const handleOpenChange = (_event: any, data: { open: boolean }) => {
        if (!data.open) {
            onClose();
        }
    };

    const handleDeleteScenario = () => {
        if (!scenario) return;

        ScenarioService.deleteScenario(scenario.id)
            .then(response => {
                if (response.status === 204) {
                    console.log('Scenario deleted successfully');
                    onDeleteScenario(scenario.id);
                    onClose();
                } else {
                    console.error('Failed to delete scenario');
                }
            })
            .catch(error => console.error('Error:', error));

        setIsDeleteConfirmOpen(false);
        setIsAgentDialogOpen(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogSurface className={styles.customDialogSurface}>
                    <DialogBody>
                        <DialogTitle>{scenario ? getTranslation("EditScenario") : getTranslation("NewScenario")}</DialogTitle>
                        <DialogContent className={styles.dialogContent}>
                            <div className="formcard">
                                <Field label={getTranslation("NameLabel")} required validationMessage={nameError}>
                                    <Input
                                        placeholder={getTranslation("NamePlaceholderScenario")}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Field>
                                <Field label={getTranslation("DescriptionLabel")} required validationMessage={descriptionError}>
                                    <Textarea
                                        placeholder={getTranslation("DescriptionPlaceholderScenario")}
                                        value={description}
                                        rows={3}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Field>
                                <div className={styles.buttonGrid}>
                                    <Field label={getTranslation("SystemAgentLabel")} required validationMessage={systemAgentError}>
                                        <Button className={styles.circularButton} onClick={() => { setAgentType('system'); setIsAgentDialogOpen(true); }}>
                                            <Add24Regular />
                                        </Button>
                                        <span className={styles.agentName}>{systemAgent ? systemAgent.name : getTranslation("NoAgentError")}</span>
                                    </Field>
                                    <Field label={getTranslation("RolePlayAgentLabel")} required validationMessage={rolePlayAgentError}>
                                        <Button className={styles.circularButton} onClick={() => { setAgentType('rolePlay'); setIsAgentDialogOpen(true); }}>
                                            <Add24Regular />
                                        </Button>
                                        <span className={styles.agentName}>{rolePlayAgent ? rolePlayAgent.name : getTranslation("NoAgentError")}</span>
                                    </Field>
                                    <Field label={getTranslation("TeacherAgentLabel")} required validationMessage={teacherAgentError}>
                                        <Button className={styles.circularButton} onClick={() => { setAgentType('teacher'); setIsAgentDialogOpen(true); }}>
                                            <Add24Regular />
                                        </Button>
                                        <span className={styles.agentName}>{teacherAgent ? teacherAgent.name : getTranslation("NoAgentError")}</span>
                                    </Field>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            {scenario && (
                                <Button className={styles.deleteButton} onClick={() => setIsDeleteConfirmOpen(true)}>{getTranslation("DeleteButton")}</Button>
                            )}
                            <Button appearance="primary" onClick={handleAddScenario}>{scenario ? getTranslation("SaveButton") : getTranslation("AddButton")}</Button>
                            <Button appearance="secondary" onClick={onClose}>{getTranslation("CancelButton")}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={(_event, data) => setIsDeleteConfirmOpen(data.open)}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{getTranslation("DeleteAskTitle")}</DialogTitle>
                        <DialogContent>
                            <p>{getTranslation("DeleteScenarioAskMessage")}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button className={styles.deleteButton} onClick={handleDeleteScenario}>{getTranslation("DeleteButton")}</Button>
                            <Button appearance="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>{getTranslation("CancelButton")}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            <AgentSelectionDialog
                isOpen={isAgentDialogOpen}
                type={agentType}
                onSelectAgent={(agent) => {
                    if (agentType === 'system') {
                        setSystemAgent(agent);
                    } else if (agentType === 'rolePlay') {
                        setRolePlayAgent(agent);
                    } else {
                        setTeacherAgent(agent);
                    }
                    setIsAgentDialogOpen(false);
                }}
                onClose={() => setIsAgentDialogOpen(false)}
            />
        </>
    );
};

export default ScenarioDialog;
