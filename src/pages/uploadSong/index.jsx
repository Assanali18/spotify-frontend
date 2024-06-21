import React, { useState } from 'react';
import axiosInstance from "../../axios/axiosInstance";
import SongForm from "../../components/SongForm";

const UploadSong = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async (formData, setUploadProgress) => {
        setIsLoading(true);

        try {
            await axiosInstance.post('/api/songs/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const totalLength = progressEvent.lengthComputable
                        ? progressEvent.total
                        : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    if (totalLength !== null) {
                        setUploadProgress(Math.round((progressEvent.loaded * 100) / totalLength));
                    }
                }
            });

            setIsLoading(false);
        } catch (error) {
            console.error('Error uploading track:', error);
            setIsLoading(false);
        }
    };

    return (
        <SongForm
            onSubmit={handleUpload}
            buttonText="Upload Track"
            isLoading={isLoading}
        />
    );
}

export default UploadSong;
