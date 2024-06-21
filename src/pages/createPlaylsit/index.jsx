import React, { useState } from 'react';
import axiosInstance from "../../axios/axiosInstance";
import PlaylistForm from "../../components/PlaylistForm";

const CreatePlaylist = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async (formData, setUploadProgress) => {
        setIsLoading(true);

        try {
            await axiosInstance.post('/api/playlists', formData, {
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
            console.error('Error uploading playlist:', error);
            setIsLoading(false);
        }
    };

    return (
        <PlaylistForm
            onSubmit={handleUpload}
            buttonText="Upload Playlist"
            isLoading={isLoading}
        />
    );
};

export default CreatePlaylist;
