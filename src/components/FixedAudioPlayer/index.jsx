import React from 'react';
import { useAudioPlayer } from "../../contexts/AudioPlayerContex";
import { BiPlay, BiPause, BiArrowToLeft, BiArrowToRight, BiPlus, BiHeart } from "react-icons/bi";
import { IconContext } from "react-icons";
import { LikeButton } from "../UserButton";
import PlaylistSelector from "../PlaylistSelector";

const FixedAudioPlayer = () => {
    const {
        currentTrack,
        isPlaying,
        togglePlayPause,
        nextTrack,
        previousTrack,
        addToPlaylist,
        toggleLike,
        handleAddToPlaylistClick,
        showPlaylists,
        setShowPlaylists,
        currentTime,
        handleTimeChange,
        audioRef
    } = useAudioPlayer();

    if (!currentTrack) return null;

    return (
        <div className="fixed z-50 bottom-0 left-0 right-0 bg-black text-white p-4 flex flex-col items-center">
            <div className="flex justify-center w-full items-center relative flex-col">
                <div className="flex items-center gap-2 absolute left-0">
                    <div className='items-center flex gap-6'>
                        <div className="w-20 h-20 overflow-hidden">
                            <img src={currentTrack.image} alt={currentTrack.title} className="h-full object-cover"/>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">{currentTrack.title}</p>
                            <p className="text-sm">{currentTrack.artistId.username}</p>
                        </div>
                    </div>

                    <div>
                        <button onClick={handleAddToPlaylistClick}>
                            <IconContext.Provider value={{color: "white", size: "1.5em"}}>
                                <BiPlus/>
                            </IconContext.Provider>
                        </button>
                        <button onClick={toggleLike}>
                            <IconContext.Provider value={{color: "white", size: "1.5em"}}>
                                <LikeButton itemId={currentTrack._id} itemType="songs"
                                            initialLikes={currentTrack.likes.map(like => like.$oid)}/>
                            </IconContext.Provider>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={previousTrack}>
                        <IconContext.Provider value={{color: "white", size: "1.5em"}}>
                            <BiArrowToLeft size={'40px'}/>
                        </IconContext.Provider>
                    </button>
                    <button onClick={togglePlayPause}>
                        <IconContext.Provider value={{color: "white", size: "2em"}}>
                            {isPlaying ? <BiPause size={'60px'}/> : <BiPlay size={'60px'}/>}
                        </IconContext.Provider>
                    </button>
                    <button onClick={nextTrack}>
                        <IconContext.Provider value={{color: "white", size: "1.5em"}}>
                            <BiArrowToRight size={'40px'}/>
                        </IconContext.Provider>
                    </button>
                </div>
                <div className="w-2/4 mt-4">
                    <input
                        type="range"
                        min="0"
                        max={audioRef.current ? audioRef.current.duration : 0}
                        value={currentTime}
                        onChange={(e) => handleTimeChange(Number(e.target.value))}
                        className=" w-full h-1 bg-gray-700 rounded-lg"
                    />
                </div>
            </div>

            <div>
                {showPlaylists && (
                    <PlaylistSelector song={currentTrack} onClose={() => setShowPlaylists(false)}/>
                )}
            </div>
        </div>
    );
};

export default FixedAudioPlayer;
