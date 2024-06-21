import React, { useState, useEffect } from 'react';
import axiosInstance from "../../axios/axiosInstance";
import SongForm from "../../components/SongForm";
import { useParams, useNavigate } from 'react-router-dom';

const EditSong = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialTitle, setInitialTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const response = await axiosInstance.get(`/api/songs/${id}`);
                setInitialTitle(response.data.title);
            } catch (error) {
                console.error('Error fetching song:', error);
            }
        };

        fetchSong();
    }, [id]);

    const handleUpdate = async (formData, setUploadProgress) => {
        setIsLoading(true);

        try {
            await axiosInstance.put(`/api/songs/${id}`, formData, {
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
            navigate('/')
        } catch (error) {
            console.error('Error updating track:', error);
            setIsLoading(false);
        }
    };

    return (
        <SongForm
            initialTitle={initialTitle}
            onSubmit={handleUpdate}
            buttonText="Update Track"
            isLoading={isLoading}
        />
    );
}

export default EditSong;
