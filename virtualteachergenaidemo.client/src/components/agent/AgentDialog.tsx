import './AgentDialog.css';
import { Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-dialog';
import { Button } from '@fluentui/react-button';
import { Input } from '@fluentui/react-input';
import { Textarea } from '@fluentui/react-textarea';
import { Field } from '@fluentui/react-field';
import { useState, useEffect } from 'react';
import { AgentItem } from '../../models/AgentItem';
import { makeStyles } from '@fluentui/react-components';
import { tokens } from '@fluentui/tokens';
import { FileUpload } from '../Utilities/FileUpload';


interface AgentDialogProps {
    onAddAgent: (agent: AgentItem) => void;
    onDeleteAgent: (agentId: string) => void;
    type: string;
    onClose: () => void;
    agent?: AgentItem;
}



const useStyles = makeStyles({
    deleteButton: {
        backgroundColor: tokens.colorPaletteRedBackground3,
        color: "white",
        ':hover': {
            backgroundColor: tokens.colorPaletteRedForeground1,
            color: 'white',
        },
    },
});

export const AgentDialog = ({ onAddAgent, onDeleteAgent, type, onClose, agent }: AgentDialogProps) => {
    const styles = useStyles();
    const [name, setName] = useState(agent?.name || '');
    const [description, setDescription] = useState(agent?.description || '');
    const [nameError, setNameError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [prompt, setPrompt] = useState(agent?.prompt || '');
    const [promptError, setPromptError] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
    

    const [fileName, setFileName] = useState<string>(agent?.fileName || '');

    useEffect(() => {
        if (agent) {
            setName(agent.name);
            setDescription(agent.description);
            setPrompt(agent.prompt);
            setFileName(agent.fileName || '');
        }
    }, [agent]);

   

    const handleFileUpload = (uploadedFileName: string) => {
        
        setFileName(uploadedFileName);
    };

    const handleUpsertAgent = () => {
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

        const newAgent = { name, description, prompt, type, id: agent?.id || "", fileName };

        const apiUrl = agent ? `/api/agent/${agent.id}` : '/api/agent';
        const method = agent ? 'PUT' : 'POST';

        fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agent),
        })
            .then(response => {
                if (response.status === 204) {
                    return null;
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                if (!agent) {
                    newAgent.id = data.id;
                }
                onAddAgent(newAgent)
            })
            .catch(error => console.error('Error:', error));

        setIsOpen(false);
        onClose();
    };

    const handleDeleteAgent = () => {
        if (!agent) return;

        fetch(`/api/agent/${agent.id}?type=${agent.type}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    console.log('Agent deleted successfully');
                    onDeleteAgent(agent.id);
                    onClose();
                } else {
                    console.error('Failed to delete agent');
                }
            })
            .catch(error => console.error('Error:', error));

        setIsDeleteConfirmOpen(false);
        setIsOpen(false);
    };

    const handleOpenChange = (_event: any, data: { open: boolean }) => {
        setIsOpen(data.open);
        if (!data.open) {
            onClose();
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{agent ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
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

                            <div className="formcard">
                                <FileUpload onFileUpload={handleFileUpload} fileName={fileName} agentId={agent?.id } />
                            </div>
                        </DialogContent>
                        <DialogActions>
                            {agent && (
                                <Button className={styles.deleteButton} onClick={() => setIsDeleteConfirmOpen(true)}>Delete</Button>
                            )}
                            <Button appearance="primary" onClick={handleUpsertAgent}>{agent ? 'Save' : 'Add'}</Button>
                            <Button appearance="secondary" onClick={() => { setIsOpen(false); onClose(); }}>Cancel</Button>

                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={(_event, data) => setIsDeleteConfirmOpen(data.open)}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <p>Are you sure you want to delete this agent? This action is irreversible.</p>
                        </DialogContent>
                        <DialogActions>
                            <Button className={styles.deleteButton} onClick={handleDeleteAgent}>Delete</Button>
                            <Button appearance="secondary" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
