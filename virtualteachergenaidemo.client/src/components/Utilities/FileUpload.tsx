import './FileUpload.css';
import { useState, useEffect, useRef } from 'react';
import { Button, Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, DialogContent } from '@fluentui/react-components';
import { Field } from '@fluentui/react-field';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { TagGroup, Tag, TagGroupProps } from '@fluentui/react-tags';
import { makeStyles } from '@fluentui/react-components';
import { v4 as uuidv4 } from 'uuid';

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

    useEffect(() => {
        const hubUrl = process.env.HUB_URL;
        const newConnection = new HubConnectionBuilder()
            .withUrl(hubUrl!)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    connection.on('DocumentParsedUpdate', (message: string) => {
                        setStatus(message);
                    });

                    connection.on('DeleteFileUpdate', (message: string) => {
                        setStatus(message);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        setNewFiles(prevNewFiles => [...prevNewFiles, ...selectedFiles]);
        setFileErrors([]);
    };

    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

    const uploadChunk = async (chunk: Blob, chunkIndex: number, totalChunks: number, fileId: string, fileName: string) => {
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('fileId', fileId);
        formData.append('fileName', fileName);

        const response = await fetch(`/api/FileUpload?connectionId=${connection?.connectionId || ''}&agentId=${agentId}&type=${type}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Chunk upload failed');
        }
    };

    const handleUploadClick = async () => {
        if (newFiles.length === 0) {
            setFileErrors(['Please select files to upload.']);
            return;
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
                    await uploadChunk(chunk, chunkIndex, totalChunks, fileId, file.name);
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

    const deleteFileFromServer = async (fileName: string) => {
        const response = await fetch(`/api/FileUpload?fileName=${fileName}&agentId=${agentId}&type=${type}&connectionId=${connection?.connectionId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('File delete failed');
        }
    };

    const confirmDeleteFile = async () => {
        if (fileToDelete) {
            try {
                await deleteFileFromServer(fileToDelete);
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
                    <Field label="Upload Files" validationMessage={fileErrors.join(', ')}>
                        <input type="file" multiple onChange={handleFileChange} className="file-input" ref={inputRef} />
                        <Button appearance="secondary" onClick={handleButtonClick}>Select Files</Button>
                    </Field>
                    <Button appearance="primary" onClick={handleUploadClick}>Upload</Button>
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
                        <DialogTitle>Delete this file?</DialogTitle>
                        <DialogContent>
                            <p>Are you sure you want to delete the file "{fileToDelete}"? This action is irreversible.</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={confirmDeleteFile} appearance="primary">Delete</Button>
                            <Button onClick={cancelDeleteFile} appearance="secondary">Cancel</Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </div>
    );
};
