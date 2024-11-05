import './AgentDialog.css';

import { Dialog, DialogTrigger, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-dialog';
import { Button } from '@fluentui/react-button';
import { Input } from '@fluentui/react-input';
import { Textarea } from '@fluentui/react-textarea';
import { Field } from '@fluentui/react-field';
import { Checkbox, CheckboxOnChangeData } from '@fluentui/react-checkbox';
import { useState } from 'react';

interface AgentDialogProps {
    onAddAgent: (agent: { name: string, description: string, prompt: string, type: string }) => void;
}

export const AgentDialog = ({ onAddAgent }: AgentDialogProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [prompt, setPrompt] = useState('');
    const [promptError, setPromptError] = useState('');
    const [isSystem, setIsSystem] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    let type = "retail";

    const handleAddAgent = () => {
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

        if (prompt.trim() === '') {
            setPromptError('Instruction is required.');
            valid = false;
        } else {
            setPromptError('');
        }

        if (!valid) return;

        if (isSystem) {
            type="system";
            onAddAgent({ name, description, prompt, type });
        }
        else {
            type="retail";
            onAddAgent({ name, description, prompt, type });
        }
        

        //Post new agent to API
        fetch('/api/agent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, description: description, prompt: prompt, type: type, id:"" }),
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
            setPrompt('');
            setIsSystem(false);
            setNameError('');
            setDescriptionError('');
            setPromptError('');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary" onClick={() => setIsOpen(true)}>Add New Agent</Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Add New Agent</DialogTitle>
                    <DialogContent>
                        <div className="formcard">
                            <Field label="Name" required validationMessage={nameError}>
                                <Input
                                    placeholder="Name your agent"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Field>
                            <Field label="Description" required validationMessage={descriptionError}>
                                <Textarea
                                    placeholder="Describe your agent"
                                    value={description}
                                    rows={3}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Field>
                        </div>
                        <div className="formcard">
                            <Field label="Instruction" required validationMessage={promptError}>
                                <Textarea
                                    placeholder="Give instruction to your agent"
                                    value={prompt}
                                    rows={10}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <Checkbox
                                    label="Is System Agent"
                                    checked={isSystem}
                                    onChange={(_e, data: CheckboxOnChangeData) => setIsSystem(!!data.checked)}
                                />
                            </Field>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" onClick={handleAddAgent}>Add</Button>
                        <Button appearance="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
