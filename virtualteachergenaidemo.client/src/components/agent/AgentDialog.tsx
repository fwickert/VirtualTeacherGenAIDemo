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
import { useLocalization } from '../../contexts/LocalizationContext';
import { AgentService } from '../../services/AgentService';
import { v4 as uuidv4 } from 'uuid';
import { useRef } from 'react';
import { Spinner } from '@fluentui/react'; // Add this import

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
    fileListColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10x',
    },
    tag: {
        width: '100%',
        display: 'block',
    },
    spinnerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
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
    const [fileNames, setFileNames] = useState<string[]>(agent?.fileNames || []);
    const [isProcessing, setIsProcessing] = useState<boolean>(false); // Add this state
    const { getTranslation } = useLocalization();

    const agentIdRef = useRef(agent?.id || uuidv4());
    const agentId = agentIdRef.current;

    useEffect(() => {
        if (agent) {
            setName(agent.name);
            setDescription(agent.description);
            setPrompt(agent.prompt);
            setFileNames(agent.fileNames || []);
        }
    }, [agent]);

    const handleFileUpload = (fileName: string) => {
        setFileNames(prevFileNames => {
            if (!prevFileNames.includes(fileName)) {
                return [...prevFileNames, fileName];
            }
            return prevFileNames;
        });
    };

    const handleUpsertAgent = () => {
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

        if (prompt.trim() === '') {
            setPromptError(getTranslation("PromptRequired"));
            valid = false;
        } else {
            setPromptError('');
        }

        if (!valid) return;

        const newAgent: AgentItem = {
            name,
            description,
            prompt,
            type,
            id: agentId,
            fileNames
        };

        const isUpdate = !!agent;

        AgentService.upsertAgent(newAgent, isUpdate)
            .then(response => {
                const data = response.data;
                onAddAgent(newAgent);
            })
            .catch(error => console.error('Error:', error));

        setIsOpen(false);
        onClose();
    };

    const handleCloneAgent = () => {
        if (!agent) return;
        setIsProcessing(true); // Set processing state to true
        agent.name = `${agent.name} (clone)`;
        AgentService.cloneAgent(agent)
            .then(response => {
                const data = response.data;
                onAddAgent(data);
            })
            .catch(error => console.error('Error:', error))
            .finally(() => {
                setIsProcessing(false); // Set processing state to false
                setIsOpen(false);
                onClose();
            });
    };

    const handleDeleteAgent = () => {
        if (!agent) return;
        setIsProcessing(true); // Set processing state to true
        AgentService.deleteAgent(agent.id, agent.type)
            .then(response => {
                if (response.status === 204) {
                    console.log('Agent deleted successfully');
                    onDeleteAgent(agent.id);
                    onClose();
                } else {
                    console.error('Failed to delete agent');
                }
            })
            .catch(error => console.error('Error:', error))
            .finally(() => {
                setIsProcessing(false); // Set processing state to false
                setIsDeleteConfirmOpen(false);
                setIsOpen(false);
            });
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
                        {isProcessing && <div className={styles.spinnerOverlay}><Spinner label={getTranslation("Processing")} /></div>} {/* Add this line */}
                        <DialogTitle>{agent ? getTranslation("EditAgentButton") : getTranslation("AddAgentButton")}</DialogTitle>
                        <DialogContent>
                            <div className="formcard">
                                <Field label={getTranslation("NameLabel")} required validationMessage={nameError}>
                                    <Input
                                        placeholder={getTranslation("NamePlaceholderAgent")}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Field>
                                <Field label={getTranslation("DescriptionLabel")} required validationMessage={descriptionError}>
                                    <Textarea
                                        placeholder={getTranslation("DescriptionPlaceholderAgent")}
                                        value={description}
                                        rows={3}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Field>
                            </div>
                            <div className="formcard">
                                <Field label={getTranslation("PromptLabel")} required validationMessage={promptError}>
                                    <Textarea
                                        placeholder={getTranslation("PromptPlaceholderAgent")}
                                        value={prompt}
                                        rows={10}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </Field>
                            </div>

                            <div className="formcard">
                                <label>{getTranslation("KnowledgeLabel")}</label>

                                <FileUpload agentId={agentId} initialFileNames={fileNames} type={type} onFileUpload={handleFileUpload} />

                            </div>
                        </DialogContent>
                        <DialogActions>
                            {agent && (
                                <Button className={styles.deleteButton} onClick={() => setIsDeleteConfirmOpen(true)} disabled={isProcessing}>
                                    {getTranslation("DeleteButton")}
                                </Button>
                            )}
                            {agent && (
                                <Button appearance="secondary" onClick={handleCloneAgent} disabled={isProcessing}>
                                    {getTranslation("CloneButton")}
                                </Button>
                            )}
                            <Button appearance="primary" onClick={handleUpsertAgent} disabled={isProcessing}>
                                {agent ? getTranslation("SaveButton") : getTranslation("AddButton")}
                            </Button>
                            <Button appearance="secondary" onClick={() => { setIsOpen(false); onClose(); }} disabled={isProcessing}>
                                {getTranslation("CancelButton")}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>

            <Dialog open={isDeleteConfirmOpen} onOpenChange={(_event, data) => setIsDeleteConfirmOpen(data.open)}>
                <DialogSurface>
                    <DialogBody>
                        {isProcessing && <div className={styles.spinnerOverlay}><Spinner label={getTranslation("Processing")} /></div>} {/* Add this line */}
                        <DialogTitle>{getTranslation("DeleteAskTitle")}</DialogTitle>
                        <DialogContent>
                            <p>{getTranslation("DeleteAgentAskMessage")}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button className={styles.deleteButton} onClick={handleDeleteAgent} disabled={isProcessing}>
                                {getTranslation("DeleteButton")}
                            </Button>
                            <Button appearance="secondary" onClick={() => setIsDeleteConfirmOpen(false)} disabled={isProcessing}>
                                {getTranslation("CancelButton")}
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};
