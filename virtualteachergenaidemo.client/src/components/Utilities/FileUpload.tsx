import './FileUpload.css';
import { useState, useEffect, useRef } from 'react';
import { Button, Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-components';
import { Field } from '@fluentui/react-field';
import { HubConnection } from '@microsoft/signalr';
import { TagGroup, Tag, TagGroupProps } from '@fluentui/react-tags';
import { makeStyles } from '@fluentui/react-components';
import { v4 as uuidv4 } from 'uuid';
import { useLocalization } from '../../contexts/LocalizationContext';
import { uploadChunk, deleteFileFromServer } from '../../services/FileService';
import { getHubConnection } from '../../services/signalR';

interface FileUploadProps {
    agentId: string | undefined;
    type: string | undefined;
    initialFileNames: string[];
    onFileUpload: (fileName: string) => void;
}

const useStyles = makeStyles({
    fileUploadGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 2fr', // First column is larger
        gap: '16px',
    },
    fileUploadControls: {
        display: 'flex',
        flexDirection: 'column',
        padding: '5px',
        gap: '8px',
    },
    tagContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '8px',
    },
});

const truncateFileName = (fileName: string, maxLength: number) => {
    if (fileName.length > maxLength) {
        return fileName.substring(0, maxLength) + '...';
    }
    return fileName;
};

const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

export const FileUpload = ({ agentId, type, initialFileNames, onFileUpload }: FileUploadProps) => {
    const styles = useStyles();
    const [files, setFiles] = useState<File[]>(initialFileNames.map(name => new File([], name)));
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [status, setStatus] = useState<string>('');
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { getTranslation } = useLocalization();

    useEffect(() => {
        const setupConnection = async () => {
            try {
                const newConnection = await getHubConnection();
                setConnection(newConnection);
                setupConnectionHandlers(newConnection);
            } catch (error) {
                console.error('Connection failed: ', error);
            }
        };

        setupConnection();
    }, []);

    useEffect(() => {
        if (connection) {
            setupConnectionHandlers(connection);
        }
    }, [connection]);

    const removeConnectionHandlers = (connection: HubConnection) => {
        connection.off('DocumentParsedUpdate');
        connection.off('DeleteFileUpdate');
    };

    const setupConnectionHandlers = (connection: HubConnection) => {
        removeConnectionHandlers(connection);

        connection.on('DocumentParsedUpdate', (message: string) => {
            setStatus(message);
        });

        connection.on('DeleteFileUpdate', (message: string) => {
            setStatus(message);
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        setNewFiles(prevNewFiles => [...prevNewFiles, ...selectedFiles]);
        setFileErrors([]);
    };

    const handleUploadClick = async () => {
        if (newFiles.length === 0) {
            setFileErrors([getTranslation("UploadRequired")]);
            return;
        }

        // If agentId is null, create a new agentId using a GUID
        let currentAgentId = agentId;
        if (!currentAgentId) {
            currentAgentId = uuidv4();
        }

        for (let i = 0; i < newFiles.length; i++) {
            const file = newFiles[i];
            const fileId = uuidv4();
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                const start = chunkIndex * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                try {
                    await uploadChunk(chunk, chunkIndex, totalChunks, fileId, file.name, connection?.connectionId || '', currentAgentId, type);
                    onFileUpload(file.name); // Call the callback function with the new file name
                } catch (error) {
                    setFileErrors(prevErrors => [...prevErrors, `File upload failed for ${file.name}. Please try again.`]);
                    return;
                }
            }
        }
    };

    const handleButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleDeleteFile: TagGroupProps["onDismiss"] = (_e, { value }) => {
        setFileToDelete(value);
        setIsDialogVisible(true);
    };

    const confirmDeleteFile = async () => {
        if (fileToDelete) {
            try {
                await deleteFileFromServer(fileToDelete, connection?.connectionId || '', agentId, type);
                const newFiles = files.filter(file => file.name !== fileToDelete);
                setFiles(newFiles);
                setNewFiles(newFiles.filter(file => !initialFileNames.includes(file.name)));
                initialFileNames.splice(initialFileNames.indexOf(fileToDelete), 1);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
                setFileToDelete(null);
            } catch (error) {
                setFileErrors(prevErrors => [...prevErrors, `File delete failed for ${fileToDelete}. Please try again.`]);
            }
        }
        setIsDialogVisible(false);
    };

    const cancelDeleteFile = () => {
        setIsDialogVisible(false);
        setFileToDelete(null);
    };

    const handleDialogOpenChange = (_event: any, data: { open: boolean }) => {
        if (!data.open) {
            setIsDialogVisible(false);
            setFileToDelete(null);
        }
    };

    return (
        <div className="file-upload">
            <div className={styles.fileUploadGrid}>
                <div className={styles.fileUploadControls}>
                    <Field validationMessage={fileErrors.join(', ')}>
                        <input type="file" multiple onChange={handleFileChange} className="file-input" ref={inputRef} />
                        <Button appearance="secondary" onClick={handleButtonClick}>{getTranslation("SelectFileButton")}</Button>
                    </Field>
                    <Button appearance="primary" onClick={handleUploadClick}>{getTranslation("UploadFileButton")}</Button>
                    <span>{status}</span>
                </div>
                <TagGroup className={styles.tagContainer} onDismiss={handleDeleteFile}>
                    {files.map((file, index) => (
                        <Tag
                            key={index}
                            value={file.name}
                            dismissible
                            appearance='brand'
                            shape='rounded'
                        >
                            {truncateFileName(file.name, 30)}
                        </Tag>
                    ))}
                </TagGroup>
            </div>
            <Dialog open={isDialogVisible} onOpenChange={handleDialogOpenChange} modalType="non-modal">
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{getTranslation("DeleteAskTitle")}</DialogTitle>
                        <DialogContent>
                            <p>{getTranslation("DeleteFileAskMessage")}</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={confirmDeleteFile} appearance="primary">{getTranslation("DeleteButton")}</Button>
                            <Button onClick={cancelDeleteFile} appearance="secondary">{getTranslation("CancelButton")}</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </div>
    );
};

