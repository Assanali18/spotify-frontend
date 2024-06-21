import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../axios/axiosInstance';
import SongList from "../../components/SongList";
import {LikeButton} from "../../components/UserButton";

const PlaylistPage = () => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/playlists/${playlistId}`);
                setPlaylist(data);
            } catch (error) {
                console.error('Error fetching playlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    if (loading) {
        return <div className="text-center text-white">Loading...</div>;
    }

    if (!playlist) {
        return <div className="text-center text-white">Playlist not found.</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center pt-[60px]">
            <div className="flex flex-col items-center space-y-4 mt-8">
                <img className="w-48 h-48 rounded-lg object-cover"
                     src={playlist.coverUrl || 'https://via.placeholder.com/400'} alt="Playlist Cover"/>
                <h1 className="text-3xl font-bold">{playlist.name}</h1>
                <p className="text-lg text-gray-400">{playlist.description}</p>
                <p className="text-sm text-gray-400">Genre: {playlist.genre}</p>
            </div>
            <LikeButton itemId={playlist._id} itemType="playlists" initialLikes={playlist.likes.map(like => like.$oid)} />
            <div className="mt-12 w-full max-w-6xl">
                <p className="text-2xl">Playlist's songs</p>
                {(playlist.songs && playlist.songs.length > 0) ? (

                    <SongList
                        songs={playlist.songs}
                        editable={false}
                    />
                ) : (
                    <div className="text-center text-white">No songs in this playlist.</div>
                )}
            </div>
        </div>
    );
};

export default PlaylistPage;
