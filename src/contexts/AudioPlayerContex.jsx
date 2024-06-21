import React, { createContext, useContext, useState } from 'react';
import FixedAudioPlayer from "../components/FixedAudioPlayer";

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const playTrack = (track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const pauseTrack = () => {
        setIsPlaying(false);
    };

    return (
        <AudioPlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, pauseTrack, setIsPlaying }}>
            {children}
            <FixedAudioPlayer />
        </AudioPlayerContext.Provider>
    );
};
