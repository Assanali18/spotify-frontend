import React, { useState, useEffect } from 'react';
import axiosInstance from "../../axios/axiosInstance";
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axiosInstance.get(`/api/users/${userId}`);
                setUsername(userResponse.data.username);
                setEmail(userResponse.data.email);
                setDescription(userResponse.data.description);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('description', description);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }


        try {
            const response = await axiosInstance.put(`/api/users/${userId}`, formData);

            console.log('Response:', response.data);

            navigate('/profile');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center pt-20">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input
                            type="text"
                            className="w-full p-3 mt-1 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 mt-1 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">About</label>
                        <textarea
                            className="w-full p-3 mt-1 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Avatar</label>
                        <input
                            type="file"
                            className="w-full p-3 mt-1 text-white rounded-lg border border-green-600 bg-green-600 focus:outline-none focus:ring focus:border-green-400"
                            onChange={(e) => setAvatarFile(e.target.files[0])}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 mt-4 bg-green-600 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
