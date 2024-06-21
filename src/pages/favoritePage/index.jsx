import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axiosInstance';
import SongList from '../../components/SongList';
import {Link} from "react-router-dom";

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState({ songs: [], playlists: [] });

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axiosInstance.get('/api/users/favorites');
                setFavorites(response.data);
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, []);
    console.log(favorites)
    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center pt-20">
            <h1 className="text-3xl font-bold mb-6">Favorites</h1>
            <div className="w-full max-w-4xl">
                {favorites.playlists.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold">Favorite Playlists</h2>

                        <div className="mt-4">

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {favorites.playlists.map(playlist => (
                                    <div key={playlist._id} className="p-4 bg-gray-800 rounded-lg">
                                        <div className='w-full'>
                                            <img className="h-[204px] w-full object-cover rounded-lg"
                                                 src={playlist.coverUrl || 'https://via.placeholder.com/150'} alt={playlist.name}/>
                                        </div>
                                        <h3 className="text-lg font-semibold">{playlist.name}</h3>
                                        <p>{playlist.description}</p>
                                        <Link to={`/playlist/${playlist._id}`}
                                              className="text-blue-500 hover:underline">View
                                            Playlist</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    )}
                {favorites.songs.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold">Favorite Songs</h2>
                        <SongList songs={favorites.songs}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
