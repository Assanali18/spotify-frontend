import React, { useState, useEffect } from 'react';

const PlaylistForm = ({ initialTitle = '', initialDescription = '', initialGenre = 'Popular', initialCoverImageFile = null, onSubmit, buttonText = 'Upload Playlist', isLoading = false }) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [genre, setGenre] = useState(initialGenre);
    const [coverImage, setCoverImage] = useState(initialCoverImageFile);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploadComplete, setIsUploadComplete] = useState(false);

    useEffect(() => {
        setTitle(initialTitle);
        setDescription(initialDescription);
        setGenre(initialGenre);
        setCoverImage(initialCoverImageFile);
    }, [initialTitle, initialDescription, initialGenre, initialCoverImageFile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploadProgress(0);
        setIsUploadComplete(false);

        const formData = new FormData();
        formData.append('name', title);
        formData.append('description', description);
        formData.append('genre', genre);
        if (coverImage) formData.append('coverImage', coverImage);

        try {
            console.log(formData)
            await onSubmit(formData, setUploadProgress);
            setIsUploadComplete(true);
        } catch (error) {
            console.error('Error uploading playlist:', error);
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
                            placeholder="Enter playlist title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            className="w-full p-3 mt-1 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Enter playlist description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Genre</label>
                        <select
                            className="w-full p-3 mt-1 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value="Popular">Popular</option>
                            <option value="For you">For you</option>
                            <option value="Hip-Hop">Hip-Hop</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className=" text-sm font-medium">Cover File</label>
                        <input
                            type="file"
                            className="w-full p-3 mt-1 text-white rounded-lg border  border-green-600 focus:outline-none focus:ring focus:border-green-400"
                            onChange={(e) => setCoverImage(e.target.files[0])}
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
                {isUploadComplete && (
                    <div className="mt-4 text-center text-green-500">
                        <p>Upload Complete!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistForm;
