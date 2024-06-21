import React from 'react';
import {useAudioPlayer} from "../../contexts/AudioPlayerContex";
import { IconContext } from "react-icons";
import { BiPlay, BiPause, BiEdit, BiTrash, BiDotsVerticalRounded, BiListPlus } from "react-icons/bi";

const FixedAudioPlayer = () => {
    const { currentTrack, isPlaying, pauseTrack, playTrack } = useAudioPlayer();

    if (!currentTrack) return null;

    const togglePlay = () => {
        if (isPlaying) pauseTrack();
        else playTrack(currentTrack);
    };

    return (
        <div
            className="fixed z-[100] bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center">
            <div className='flex items-center gap-10'>
                <div className="w-20 h-20 overflow-hidden">
                    <img src={currentTrack.image} alt={currentTrack.title} className="h-full object-cover"/>
                </div>
                <div>{currentTrack.title}</div>
            </div>
            <button onClick={togglePlay}>
                {isPlaying ? <BiPause size={"30"}/> : <BiPlay/>}
            </button>
        </div>
    );
};

export default FixedAudioPlayer;
