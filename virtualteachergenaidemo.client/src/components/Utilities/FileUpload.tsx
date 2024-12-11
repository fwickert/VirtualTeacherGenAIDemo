import { useState, useEffect } from 'react';
import { Button } from '@fluentui/react-button';
import { Field } from '@fluentui/react-field';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

interface FileUploadProps {
    onFileUpload: (fileName: string) => void;
    fileName?: string;
}

export const FileUpload = ({ onFileUpload, fileName }: FileUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string>('');
    const [displayFileName, setDisplayFileName] = useState<string>(fileName || '');
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        if (fileName) {
            setDisplayFileName(fileName);
        }
    }, [fileName]);

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
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
        setFileError('');
        if (selectedFile) {
            setDisplayFileName(selectedFile.name);
            onFileUpload(selectedFile.name);
        }
    };

    const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

    const uploadChunk = async (chunk: Blob, chunkIndex: number, totalChunks: number) => {
        const formData = new FormData();
        formData.append('fileStream', chunk);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());

        
        const response = await fetch(`/api/FileUpload?connectionId=${connection?.connectionId || ''}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Chunk upload failed');
        }
    };

    const handleUploadClick = async () => {
        if (!file) {
            setFileError('Please select a file to upload.');
            return;
        }

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            const start = chunkIndex * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            try {
                await uploadChunk(chunk, chunkIndex, totalChunks);
            } catch (error) {
                setFileError('File upload failed. Please try again.');
                return;
            }
        }

        onFileUpload(file.name);
    };

    return (
        <div className="file-upload">
            <Field label="Upload File" required validationMessage={fileError}>
                <input type="file" onChange={handleFileChange} />
            </Field>
            <Button appearance="primary" onClick={handleUploadClick}>Upload</Button>
            {displayFileName && <p>File: {displayFileName}</p>}
            <span>{status}</span>
        </div>
    );
};
