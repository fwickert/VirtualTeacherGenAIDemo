import './scenarioDialog.css';
import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-dialog';
import { Button } from '@fluentui/react-button';
import { Input } from '@fluentui/react-input';
import { Textarea } from '@fluentui/react-textarea';
import { Field } from '@fluentui/react-field';
import { useState } from 'react';
import { Agent } from '../../models/ScenarioItem'; 
import { makeStyles } from '@fluentui/react-components';


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
});

interface ScenarioDialogProps {
    onAddScenario: (scenario: { name: string, description: string, agents: Agent[] }) => void;
}

export const ScenarioDialog = ({ onAddScenario }: ScenarioDialogProps) => {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [systemAgent, setSystemAgent] = useState({ id: '1', name: '', prompt: '', type: 'system' });
    const [businessAgent, setBusinessAgent] = useState({ id: '2', name: '', prompt: '', type: 'retail' });

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

        if (systemAgent.name.trim() === '' || systemAgent.prompt.trim() === '') {
            valid = false;
        }

        if (businessAgent.name.trim() === '' || businessAgent.prompt.trim() === '') {
            valid = false;
        }

        if (!valid) return;

        const agents = [
            new Agent(systemAgent.id, systemAgent.name, systemAgent.prompt, systemAgent.type),
            new Agent(businessAgent.id, businessAgent.name, businessAgent.prompt, businessAgent.type)
        ];

        onAddScenario({ name, description, agents });

        // Post new scenario to API
        fetch('/api/scenario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, description: description, agents: agents, id: "" }),
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));

        setIsOpen(false); // Close the dialog
    };

    const handleOpenChange = (_event: any, data: { open: boolean }) => {
        setIsOpen(data.open);
        if (data.open) {
            // Reset form fields when the dialog is opened
            setName('');
            setDescription('');
            setNameError('');
            setDescriptionError('');
            setSystemAgent({ id: '1', name: '', prompt: '', type: 'system' });
            setBusinessAgent({ id: '2', name: '', prompt: '', type: 'retail' });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary" onClick={() => setIsOpen(true)}>Add New Scenario</Button>
            </DialogTrigger>
            <DialogSurface className={classes.customDialogSurface}>
                <DialogBody>
                    <DialogTitle>Add New Scenario</DialogTitle>
                    <DialogContent className={classes.dialogContent }>
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
                            <Field label="System Agent Name" required>
                                <Input
                                    placeholder="Name your system agent"
                                    value={systemAgent.name}
                                    onChange={(e) => setSystemAgent({ ...systemAgent, name: e.target.value })}
                                />
                            </Field>
                            <Field label="System Agent Prompt" required>
                                <Textarea
                                    placeholder="Prompt for your system agent"
                                    value={systemAgent.prompt}
                                    rows={3}
                                    onChange={(e) => setSystemAgent({ ...systemAgent, prompt: e.target.value })}
                                />
                            </Field>
                            <Field label="Business Agent Name" required>
                                <Input
                                    placeholder="Name your business agent"
                                    value={businessAgent.name}
                                    onChange={(e) => setBusinessAgent({ ...businessAgent, name: e.target.value })}
                                />
                            </Field>
                            <Field label="Business Agent Prompt" required>
                                <Textarea
                                    placeholder="Prompt for your business agent"
                                    value={businessAgent.prompt}
                                    rows={3}
                                    onChange={(e) => setBusinessAgent({ ...businessAgent, prompt: e.target.value })}
                                />
                            </Field>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" onClick={handleAddScenario}>Add</Button>
                        <Button appearance="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default ScenarioDialog;
