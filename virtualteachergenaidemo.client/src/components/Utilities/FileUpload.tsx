import { useState, useEffect } from 'react';
import { Button } from '@fluentui/react-button';
import { Field } from '@fluentui/react-field';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
    onFileUpload: (fileName: string) => void;    
    agentId: string | undefined;
    onChange?: (fileNames: string[]) => void;
}

export const FileUpload = ({ onFileUpload, fileNames, agentId, onChange }: FileUploadProps) => {
    const [files, setFiles] = useState<File[]>([]);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const [displayFileNames, setDisplayFileNames] = useState<string[]>(fileNames ? [fileNames] : []);
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [status, setStatus] = useState<string>('');
    const [fileIds, setFileIds] = useState<string[]>([]);

    useEffect(() => {
        if (fileNames) {
            setDisplayFileNames([fileNames]);
        }
    }, [fileNames]);

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
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        setFiles(selectedFiles);
        setFileErrors([]);
        setDisplayFileNames(selectedFiles.map(file => file.name));
        setFileIds(selectedFiles.map(() => uuidv4())); // Generate unique IDs for each file
        if (onChange) {
            onChange(selectedFiles.map(file => file.name));
        }
        selectedFiles.forEach(file => onFileUpload(file.name));
    };

    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

    const uploadChunk = async (chunk: Blob, chunkIndex: number, totalChunks: number, fileId: string, fileName:string) => {
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('fileId', fileId); 
        formData.append('fileName', fileName);

        const response = await fetch(`/api/FileUpload?connectionId=${connection?.connectionId || ''}&agentId=${agentId}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Chunk upload failed');
        }
    };

    const handleUploadClick = async () => {
        if (files.length === 0) {
            setFileErrors(['Please select files to upload.']);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileId = fileIds[i];
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                const start = chunkIndex * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                try {
                    await uploadChunk(chunk, chunkIndex, totalChunks, fileId, files[i].name);
                } catch (error) {
                    setFileErrors(prevErrors => [...prevErrors, `File upload failed for ${file.name}. Please try again.`]);
                    return;
                }
            }

            onFileUpload(file.name);
        }
    };

    return (
        <div className="file-upload">
            <Field label="Upload Files" required validationMessage={fileErrors.join(', ')}>
                <input type="file" multiple onChange={handleFileChange} />
            </Field>
            <Button appearance="primary" onClick={handleUploadClick}>Upload</Button>
            {displayFileNames.map((name, index) => (
                <p key={index}>File: {name}</p>
            ))}
            <span>{status}</span>
        </div>
    );
};
