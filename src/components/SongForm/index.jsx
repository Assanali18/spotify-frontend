import React, { useState, useEffect } from 'react';
import axiosInstance from "../../axios/axiosInstance";

const SongForm = ({ initialTitle = '', initialSongFile = null, initialImageFile = null, onSubmit, buttonText = 'Upload Track', isLoading = false }) => {
    const [title, setTitle] = useState(initialTitle);
    const [songFile, setSongFile] = useState(initialSongFile);
    const [imageFile, setImageFile] = useState(initialImageFile);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploadComplete, setIsUploadComplete] = useState(false);

    useEffect(() => {
        setTitle(initialTitle);
        setSongFile(initialSongFile);
        setImageFile(initialImageFile);
    }, [initialTitle, initialSongFile, initialImageFile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadProgress(0);
        setIsUploadComplete(false);

        const formData = new FormData();
        formData.append('title', title);
        if (songFile) formData.append('song', songFile);
        if (imageFile) formData.append('image', imageFile);

        try {
            await onSubmit(formData, setUploadProgress);
            setIsUploadComplete(true);
        } catch (error) {
            console.error('Error uploading track:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
            <div className="w-full max-w-md mx-auto p-8 bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <img
                        src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
                        alt="Spotify Logo"
                        className="w-32 mx-auto"
                    />
                    <h1 className="text-3xl font-bold mt-4">{buttonText}</h1>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            className="w-full p-3 mt-1 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter track title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className=" text-sm font-medium">Track File</label>
                        <input
                            type="file"
                            className="w-full p-3 mt-1 text-white rounded-lg border  border-green-600 focus:outline-none focus:ring focus:border-green-400"
                            onChange={(e) => setSongFile(e.target.files[0])}
                        />
                    </div>
                    <div>
                        <label className=" text-sm font-medium">Cover File</label>
                        <input
                            type="file"
                            className="w-full p-3 mt-1 text-white rounded-lg border  border-green-600 focus:outline-none focus:ring focus:border-green-400"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 mt-4 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Wait...' : buttonText}
                    </button>
                </form>
                {isLoading && (
                    <div className="mt-4 text-center">
                        <p>Uploading: {uploadProgress}%</p>
                    </div>
                )}
                {isUploadComplete && (
                    <div className="mt-4 text-center text-green-500">
                        <p>Upload Complete!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SongForm;
