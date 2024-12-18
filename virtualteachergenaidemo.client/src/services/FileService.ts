import axios from 'axios';

const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

export const uploadChunk = async (chunk: Blob, chunkIndex: number, totalChunks: number, fileId: string, fileName: string, connectionId: string, agentId: string | undefined, type: string | undefined) => {
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('fileId', fileId);
    formData.append('fileName', fileName);

    const response = await axios.post(`/api/FileUpload`, formData, {
        params: {
            connectionId,
            agentId,
            type
        }
    });

    if (response.status !== 200) {
        throw new Error('Chunk upload failed');
    }
};

export const deleteFileFromServer = async (fileName: string, connectionId: string, agentId: string | undefined, type: string | undefined) => {
    const response = await axios.delete(`/api/FileUpload`, {
        params: {
            fileName,
            connectionId,
            agentId,
            type
        }
    });

    if (response.status !== 200) {
        throw new Error('File delete failed');
    }
};
