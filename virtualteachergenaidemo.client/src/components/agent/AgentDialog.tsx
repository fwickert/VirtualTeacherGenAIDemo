import './AgentDialog.css';
import { Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-dialog';
import { Button } from '@fluentui/react-button';
import { Input } from '@fluentui/react-input';
import { Textarea } from '@fluentui/react-textarea';
import { Field } from '@fluentui/react-field';
import { useState } from 'react';

interface AgentDialogProps {
    onAddAgent: (agent: { name: string, description: string, prompt: string, type: string }) => void;
    type: string;
    onClose: () => void;
}

export const AgentDialog = ({ onAddAgent, type, onClose }: AgentDialogProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [prompt, setPrompt] = useState('');
    const [promptError, setPromptError] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(true);

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

        onAddAgent({ name, description, prompt, type });

        // Post new agent to API
        fetch('/api/agent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, description: description, prompt: prompt, type: type, id: "" }),
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch(error => console.error('Error:', error));
        setIsOpen(false); // Close the dialog
        onClose();
    };

    const handleOpenChange = (_event: any, data: { open: boolean }) => {
        setIsOpen(data.open);
        if (!data.open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button appearance="primary" onClick={handleAddAgent}>Add</Button>
                        <Button appearance="secondary" onClick={() => { setIsOpen(false); onClose(); }}>Cancel</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};
