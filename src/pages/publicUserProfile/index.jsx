import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "../../axios/axiosInstance";
import SongList from "../../components/SongList";

const PublicUserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [songs, setSongs] = useState([]);
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('id');

    useEffect(() => {
        if (userId === currentUserId) {
            navigate('/profile');
            return;
        }

        const fetchUserData = async () => {
            try {
                const userResponse = await axiosInstance.get(`api/users/${userId}`);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchUserSongs = async () => {
            try {
                const songsResponse = await axiosInstance.get(`api/songs/user/${userId}`);
                setSongs(songsResponse.data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        fetchUserData();
        fetchUserSongs();
    }, [userId, currentUserId, navigate]);

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center pt-[60px]">
            {user && (
                <div className="flex flex-col items-center space-y-4 mt-8">
                    <div className="flex flex-col items-center">
                        <img className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover"
                             src={user.avatarUrl || 'https://via.placeholder.com/150'} alt="User Avatar"/>
                    </div>

                    <h1 className="text-3xl font-bold">{user.username}'s profile</h1>
                    <p className="text-sm text-gray-400">Email: {user.email}</p>
                    <p className="text-sm text-gray-400">About: {user.description}</p>
                </div>
            )}
            <div className="mt-12 w-full max-w-6xl pl-40">
                <h2 className="text-2xl font-semibold mb-4">{user ? `${user.username}'s Songs` : "User's Songs"}</h2>
                <SongList
                    songsUrl={`/api/songs/user/${userId}`}
                />
            </div>
        </div>
    );
}

export default PublicUserProfile;
