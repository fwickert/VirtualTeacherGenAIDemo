import { useState, useEffect } from 'react';
import { Button } from '@fluentui/react-button';
import { Field } from '@fluentui/react-field';

interface FileUploadProps {
    onFileUpload: (fileName: string) => void;
    fileName?: string;
}

export const FileUpload = ({ onFileUpload, fileName }: FileUploadProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string>('');
    const [displayFileName, setDisplayFileName] = useState<string>(fileName || '');

    useEffect(() => {
        if (fileName) {
            setDisplayFileName(fileName);
        }
    }, [fileName]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
        setFileError('');
        if (selectedFile) {
            setDisplayFileName(selectedFile.name);
            onFileUpload(selectedFile.name);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            setFileError('Please select a file to upload.');
            return;
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
        </div>
    );
};
