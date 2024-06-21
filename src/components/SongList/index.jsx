import React, { useEffect, useState, useRef } from 'react';
import { IconContext } from "react-icons";
import { BiPlay, BiPause, BiEdit, BiTrash, BiDotsVerticalRounded, BiListPlus } from "react-icons/bi";
import axiosInstance from "../../axios/axiosInstance";
import SongService from "../../services/songService";
import { Link, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import PlaylistSelector from "../PlaylistSelector";
import {LikeButton} from "../UserButton";
import {useAudioPlayer} from "../../contexts/AudioPlayerContex";

const SongsList = ({ songsUrl, songs: initialSongs = [], editable = false }) => {

    const [songs, setSongs] = useState([]);
    const [playingIndex, setPlayingIndex] = useState(null);
    const [currentTimes, setCurrentTimes] = useState({});
    const audioRefs = useRef([]);
    const navigate = useNavigate();
    const songService = new SongService();
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [showMenu, setShowMenu] = useState({});
    const { setTrack, pauseTrack, isPlaying, setIsPlaying, audioRef, currentTime, handleTimeChange } = useAudioPlayer();
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(`${'https://spotify-production-f726.up.railway.app'}`);

        return () => {
            socketRef.current.disconnect();
        };
    }, []);
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axiosInstance.get(songsUrl);
                setSongs(response.data);

            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };
        if (songsUrl) {
            fetchSongs();
        } else {
            setSongs(initialSongs);
        }
    }, [songsUrl]);

    const togglePlayPause = (index, song) => {
        if (isPlaying && playingIndex === index) {
            pauseTrack();
            setPlayingIndex(null);
            socketRef.current.emit('updateTrack', { userId: localStorage.getItem('id'), track: null, artist: null });
        } else {
            if (playingIndex !== index) {
                setTrack(song);
            } else {
                audioRef.current.play();
            }
            setIsPlaying(true);
            setPlayingIndex(index);
            socketRef.current.emit('updateTrack', { userId: localStorage.getItem('id'), track: song.title, artist: song.artistId.username });
        }
    };


    const handleAddToPlaylistClick = (song) => {
        setSelectedSong(song);
        setShowPlaylists(true);
    };



    const handleDelete = async (songId) => {
        try {
            await songService.deleteSong(songId);
            setSongs(songs => songs.filter(song => song._id !== songId));
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    };

    const handleEdit = (songId) => {
        navigate(`/editSong/${songId}`);
    };

    const toggleMenu = (songId) => {
        setShowMenu(prev => ({ ...prev, [songId]: !prev[songId] }));
    };

    return (
        <div className="flex flex-col space-y-4">
            {songs.map((song, index) => (
                <div key={song._id} className="flex items-center bg-gray-800 text-white p-2 rounded-lg">
                    <button onClick={() => togglePlayPause(index, song)} className="bg-black p-2 rounded-full">
                        <IconContext.Provider value={{ color: "white", size: "2em" }}>
                            {playingIndex === index && isPlaying ? <BiPause /> : <BiPlay />}
                        </IconContext.Provider>
                    </button>
                    <div className="flex flex-col w-full mb-2 px-4">
                        <div className="mb-2">
                            <h3 className="text-lg font-semibold">{song.title}</h3>
                            <Link className="underline text-[12px] text-gray-400"
                                  to={`/user/${song.artistId._id}`}>{song.artistId.username}</Link>
                        </div>
                    </div>
                    <div className="w-20 h-20 overflow-hidden">
                        <img src={song.image} alt={song.title} className="h-full object-cover"/>
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu(song._id)} className="p-2">
                            <BiDotsVerticalRounded size="1.5em"/>
                        </button>
                        {showMenu[song._id] && (
                            <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 text-black">
                                <button onClick={() => handleAddToPlaylistClick(song)}
                                        className="block px-4 py-2 text-sm text-blue-500 w-full text-left">
                                    <BiListPlus /> Add to Playlist
                                </button>
                                {editable && (
                                    <>
                                        <button onClick={() => handleEdit(song._id)}
                                                className="block px-4 py-2 text-sm text-green-500 w-full text-left">
                                            <BiEdit /> Edit
                                        </button>
                                        <button onClick={() => handleDelete(song._id)}
                                                className="block px-4 py-2 text-sm text-red-500 w-full text-left">
                                            <BiTrash /> Delete
                                        </button>
                                    </>
                                )}

                            </div>
                        )}
                    </div>
                    {showPlaylists && selectedSong && (
                        <PlaylistSelector  song={selectedSong} onClose={() => setShowPlaylists(false)}/>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SongsList;
