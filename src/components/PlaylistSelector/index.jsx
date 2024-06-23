import { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import {Link} from "react-router-dom";
import "./PlaylistSelector.css"
import {useNavigate} from "react-router-dom";


const PlaylistSelector = ({ song, onClose }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axiosInstance.get(`/api/playlists/user/${userId}`);
                const playlistsData = response.data;
                const playlistsWithSongPresence = playlistsData.map(playlist => {
                    const isSongPresent = playlist.songs.some(s => s._id === song._id);
                    return {...playlist, isSongPresent};
                });

                setPlaylists(playlistsWithSongPresence);

            } catch (error) {
                console.error('Error fetching playlists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [userId, song._id]);

    const handleAddSongToPlaylist = (playlistId) => {
        if (!playlists.find(playlist => playlist._id === playlistId).isSongPresent) {
            axiosInstance.post(`/api/playlists/${playlistId}/add-song`, { songId: song._id, playlistId: playlistId })
                .then(response => {
                    alert('Song added to playlist!');
                    onClose();
                })
                .catch(error => console.error('Error adding song to playlist:', error));
        } else {
            alert('Song is already in the playlist.');
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="w-full max-w-lg mx-auto p-8 bg-gray-800 rounded-lg shadow-lg text-white">
                <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold">Select a playlist for "{song.title}"</h4>
                </div>
                {loading ? (
                    <div className="text-center text-lg">
                        Loading...
                    </div>
                ) : (
                    <>
                        {playlists.length > 0 ? (
                            <div className="mb-6 hide-scrollbar" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                                {playlists.map(playlist => (
                                    <div key={playlist._id}
                                         className="flex justify-between items-center py-4 border-b border-gray-700 last:border-b-0">
                                        <img src={playlist.coverUrl} alt={playlist.name} className="w-16 h-16 rounded" />
                                        <Link to={`/playlist/${playlist._id}`} className="text-lg flex-1 mx-4">
                                            {playlist.name}
                                        </Link>
                                        <button
                                            onClick={() => handleAddSongToPlaylist(playlist._id)}
                                            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out ${playlist.isSongPresent ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={playlist.isSongPresent}
                                        >
                                            {playlist.isSongPresent ? 'Already Added' : 'Add'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-lg">
                                <p>No playlists found. Create your own playlist:</p>
                                <button
                                    onClick={() =>{
                                        navigate('/upload/playlist');
                                        onClose();
                                    }

                                }
                                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                                >
                                    Create Playlist
                                </button>
                            </div>
                        )}
                    </>
                )}
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PlaylistSelector;
