import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import FixedAudioPlayer from "../components/FixedAudioPlayer";
import { io } from "socket.io-client";

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(new Audio());
    const [showPlaylists, setShowPlaylists] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(`${'https://spotify-production-f726.up.railway.app/'}`);

        socketRef.current.on('connect', () => {
            console.log('WebSocket connected');
        });

        socketRef.current.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        const updateCurrentTime = () => {
            setCurrentTime(audioRef.current.currentTime);
        };

        audioRef.current.addEventListener('timeupdate', updateCurrentTime);

        return () => {
            audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
        };
    }, []);

    const setTrack = (track) => {
        setCurrentTrack(track);
        if (audioRef.current) {
            audioRef.current.src = track.songUrl;
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const pauseTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        setIsPlaying(true);
                        if (currentTrack) {
                            socketRef.current.emit('updateTrack', { userId: localStorage.getItem('id'), track: currentTrack.title, artist: currentTrack.artistId.username });
                        }
                    }).catch(error => {
                        console.error('Playback prevented', error);
                    });
                }
            } else {
                audioRef.current.pause();
                setIsPlaying(false);
                socketRef.current.emit('updateTrack', { userId: localStorage.getItem('id'), track: null, artist: null });
            }
        }
    };

    const handleTimeChange = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleAddToPlaylistClick = () => {
        setShowPlaylists(true);
    };

    return (
        <AudioPlayerContext.Provider value={{
            currentTrack,
            isPlaying,
            setTrack,
            togglePlayPause,
            handleTimeChange,
            currentTime,
            audioRef,
            pauseTrack,
            setIsPlaying,
            handleAddToPlaylistClick,
            showPlaylists,
            setShowPlaylists
        }}>
            {children}
            <FixedAudioPlayer />
        </AudioPlayerContext.Provider>
    );
};
