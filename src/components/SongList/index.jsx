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
    const socket = io(`${'http://localhost:3000'}`);

    const [songs, setSongs] = useState([]);
    const [playingIndex, setPlayingIndex] = useState(null);
    const [currentTimes, setCurrentTimes] = useState({});
    const audioRefs = useRef([]);
    const navigate = useNavigate();
    const songService = new SongService();
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [showMenu, setShowMenu] = useState({});
    const { playTrack, setIsPlaying } = useAudioPlayer();


    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axiosInstance.get(songsUrl);
                setSongs(response.data);
                initializeCurrentTimes(response.data);
                audioRefs.current = response.data.map(() => React.createRef());
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        if (songsUrl) {
            fetchSongs();
        } else {
            initializeCurrentTimes(initialSongs);
            setSongs(initialSongs);
            audioRefs.current = initialSongs.map(() => React.createRef());
        }
    }, [songsUrl]);

    const initializeCurrentTimes = (songsData) => {
        const times = {};
        songsData.forEach(song => {
            times[song._id] = 0;
        });
        setCurrentTimes(times);
    };

    const togglePlayPause = (index, song) => {
        const audio = audioRefs.current[index].current;
        if (audio) {
            if (audio.paused) {
                if (playingIndex !== null && playingIndex !== index) {
                    audioRefs.current[playingIndex].current.pause();
                }
                audio.play();
                setPlayingIndex(index);
                socket.emit('updateTrack', { userId: localStorage.getItem('id'), track: song.title, artist: song.artistId.username });
                playTrack(song);
            } else {
                audio.pause();
                setIsPlaying(false);
                setPlayingIndex(null);
                socket.emit('updateTrack', { userId: localStorage.getItem('id'), track: null, artist: null });
            }
        }
    };

    const handleAddToPlaylistClick = (song) => {
        setSelectedSong(song);
        setShowPlaylists(true);
    };

    const handleTimeChange = (index, time) => {
        const audio = audioRefs.current[index].current;
        if (audio) {
            audio.currentTime = time;
            setCurrentTimes(prev => ({ ...prev, [songs[index]._id]: time }));
        }
    };

    const handleTimeUpdate = (index) => {
        const audio = audioRefs.current[index].current;
        if (audio) {
            setCurrentTimes(prev => ({ ...prev, [songs[index]._id]: audio.currentTime }));
        }
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
                            {playingIndex === index ? <BiPause /> : <BiPlay />}
                        </IconContext.Provider>
                    </button>
                    <div className="flex flex-col w-full mb-2 px-4">
                        <div className="mb-2">
                            <h3 className="text-lg font-semibold">{song.title}</h3>
                            <Link className="underline text-[12px] text-gray-400"
                                  to={`/user/${song.artistId._id}`}>{song.artistId.username}</Link>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={audioRefs.current[index]?.current?.duration || 0}
                            value={currentTimes[song._id] || 0}
                            onChange={(e) => handleTimeChange(index, Number(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg"
                        />
                    </div>
                    <audio
                        ref={audioRefs.current[index]}
                        src={song.songUrl}
                        preload="metadata"
                        onTimeUpdate={() => handleTimeUpdate(index)}
                    ></audio>
                    <div className="w-20 h-20 overflow-hidden">
                        <img src={song.image} alt={song.title} className="h-full object-cover"/>
                    </div>
                    <div className="relative">
                        <button onClick={() => toggleMenu(song._id)} className="p-2">
                            <BiDotsVerticalRounded size="1.5em"/>
                        </button>
                        <LikeButton itemId={song._id} itemType="songs" initialLikes={song.likes.map(like => like.$oid)} />
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
                        <PlaylistSelector song={selectedSong} onClose={() => setShowPlaylists(false)}/>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SongsList;
