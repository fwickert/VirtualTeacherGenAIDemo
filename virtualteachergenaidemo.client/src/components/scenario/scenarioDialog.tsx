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

const useStyles = makeStyles({
    customDialogSurface: {
        width: '90%', // Set your desired width
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
});

interface ScenarioDialogProps {
    onAddScenario: (scenario: { name: string, description: string, agents: Agent[] }) => void;
    onClose: () => void;
    isOpen: boolean;
    scenario?: ScenarioItem | null;
}

export const ScenarioDialog = ({ onAddScenario, onClose, isOpen, scenario }: ScenarioDialogProps) => {
    const classes = useStyles();
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
    const [agentType, setAgentType] = useState<'system' | 'retail' | 'teacher'>('system');

    useEffect(() => {
        if (scenario) {
            setName(scenario.name);
            setDescription(scenario.description);
            // Assuming scenario.agents is an array of agents
            setSystemAgent(scenario.agents.find(agent => agent.type === 'system') || null);
            setRolePlayAgent(scenario.agents.find(agent => agent.type === 'retail') || null);
            setTeacherAgent(scenario.agents.find(agent => agent.type === 'teacher') || null);
        }
    }, [scenario]);

    const handleAddScenario = () => {
        let valid = true;
        if (name.trim() === '') {
            setNameError('Name is required.');
            valid = false;
        } else {
            setNameError('');
        }

        if (description.trim() === '') {
            setDescriptionError('Description is required.');
            valid = false;
        } else {
            setDescriptionError('');
        }

        if (!systemAgent) {
            setSystemAgentError('System Agent is required.');
            valid = false;
        } else {
            setSystemAgentError('');
        }

        if (!rolePlayAgent) {
            setRolePlayAgentError('RolePlay Agent is required.');
            valid = false;
        } else {
            setRolePlayAgentError('');
        }

        if (!teacherAgent) {
            setTeacherAgentError('Teacher Agent is required.');
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

        onAddScenario({ name, description, agents });

        // Post new scenario to API
        fetch('/api/scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, description: description, agents: agents, id: scenario ? scenario.id : "" }),
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));

        onClose();
    };

    const handleOpenChange = (_event: any, data: { open: boolean }) => {
        if (!data.open) {
            onClose();
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogSurface className={classes.customDialogSurface}>
                    <DialogBody>
                        <DialogTitle>{scenario ? 'Edit Scenario' : 'Add New Scenario'}</DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            <div className="formcard">
                                <Field label="Name" required validationMessage={nameError}>
                                    <Input
                                        placeholder="Name your scenario"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Field>
                                <Field label="Description" required validationMessage={descriptionError}>
                                    <Textarea
                                        placeholder="Describe your scenario"
                                        value={description}
                                        rows={3}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Field>
                                <div className={classes.buttonGrid}>
                                    <Field label="System Agent" required validationMessage={systemAgentError}>
                                        <Button className={classes.circularButton} onClick={() => { setAgentType('system'); setIsAgentDialogOpen(true); }}>
                                            <Add24Regular />
                                        </Button>
                                        <span className={classes.agentName}>{systemAgent ? systemAgent.name : 'No agent selected'}</span>
                                    </Field>
                                    <Field label="RolePlay Agent" required validationMessage={rolePlayAgentError}>
                                        <Button className={classes.circularButton} onClick={() => { setAgentType('retail'); setIsAgentDialogOpen(true); }}>
                                            <Add24Regular />
                                        </Button>
                                        <span className={classes.agentName}>{rolePlayAgent ? rolePlayAgent.name : 'No agent selected'}</span>
                                    </Field>
                                    <Field label="Teacher Agent" required validationMessage={teacherAgentError}>
                                        <Button className={classes.circularButton} onClick={() => { setAgentType('teacher'); setIsAgentDialogOpen(true); }}>
                                            <Add24Regular />
                                        </Button>
                                        <span className={classes.agentName}>{teacherAgent ? teacherAgent.name : 'No agent selected'}</span>
                                    </Field>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="primary" onClick={handleAddScenario}>{scenario ? 'Save' : 'Add'}</Button>
                            <Button appearance="secondary" onClick={onClose}>Cancel</Button>
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
                    } else if (agentType === 'retail') {
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
