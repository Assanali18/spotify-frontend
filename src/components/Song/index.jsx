import {BiPause, BiPlay} from "react-icons/bi";
import { IconContext } from "react-icons";

export default function Song({ song, onPlayPause, playing, onTimeChange, onTimeUpdate }) {
    return (
        <div className="flex items-center bg-gray-800 text-white p-2 rounded-lg">
            <button onClick={onPlayPause} className="bg-black p-2 rounded-full">
                <IconContext.Provider value={{color: "white", size: "2em"}}>
                    {playing ? <BiPause/> : <BiPlay/>}
                </IconContext.Provider>
            </button>
            <div className="flex flex-col w-full mb-2 px-4">
                <h3 className="text-lg font-semibold">{song.title}</h3>
                <p className="text-[12px] text-gray-400">{song.artistId}</p>
                <input type="range" min="0" max={song.duration || 0} onChange={onTimeChange}
                       className="w-full h-1 bg-gray-700 rounded-lg"/>
            </div>
            <audio src={song.songUrl} preload="none" onTimeUpdate={onTimeUpdate}></audio>
            <img src={song.image} alt={song.title} className="w-20 h-20 ml-auto rounded-full"/>
        </div>
    );
}