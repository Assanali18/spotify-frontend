import React, { useEffect, useState } from 'react';
import axiosInstance from "../../axios/axiosInstance";
import SongList from "../../components/SongList";
import {Link} from "react-router-dom";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [songs, setSongs] = useState([]);
    const userId = localStorage.getItem('id');
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
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
        const fetchUserPlaylists = async () => {
            try {
                const response = await axiosInstance.get(`api/playlists/user/${userId}`);
                setPlaylists(response.data);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            }
        };

        fetchUserPlaylists();
        fetchUserData();
        fetchUserSongs();
    }, [userId]);

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
                    <button className="mt-4 p-2 bg-green-600 rounded-lg hover:bg-green-700 transition">
                        <Link to={'/profile/edit'}>
                            Edit Profile
                        </Link>
                    </button>
                </div>
            )}
            <div className="mt-12 w-full max-w-6xl pl-40">
                <h2 className="text-2xl font-semibold mb-4">{user ? `${user.username}'s Songs` : "User's Songs"}</h2>
                <SongList
                    songsUrl={`/api/songs/user/${userId}`}
                    editable={true}
                />

                <div className="mt-4">
                    <h2 className="text-2xl font-semibold mb-4">Playlists</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {playlists.map(playlist => (
                            <div key={playlist._id} className="p-4 bg-gray-800 rounded-lg">
                                <div className='w-full'>
                                    <img className="h-[204px] w-full object-cover rounded-lg"
                                         src={playlist.coverUrl || 'https://via.placeholder.com/150'}/>
                                </div>
                                <h3 className="text-lg font-semibold">{playlist.name}</h3>
                                <p>{playlist.description}</p>
                                <Link to={`/playlist/${playlist._id}`} className="text-blue-500 hover:underline">View
                                    Playlist</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default UserProfile;
