import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axiosInstance';
import SongList from "../../components/SongList";
import { Link } from "react-router-dom";

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ users: [], songs: [], playlists: [] });

    useEffect(() => {
        const handleSearch = async () => {
            if (query.trim() !== '') {
                try {
                    const response = await axiosInstance.get(`/api/search?query=${query}`);
                    setResults({
                        users: response.data.users || [],
                        songs: response.data.songs || [],
                        playlists: response.data.playlists || []
                    });
                } catch (error) {
                    console.error('Error performing search:', error);

                    setResults({ users: [], songs: [], playlists: [] });
                }
            } else {
                setResults({ users: [], songs: [], playlists: [] });
            }
        };

        handleSearch();
    }, [query]);

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center pt-20">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Search</h1>
                <div className="flex items-center justify-center space-x-4 mb-6">
                    <input
                        type="text"
                        className="w-1/2 p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter search query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="mt-8">
                    {results.users?.length > 0 && (
                        <ul className="mt-4 space-y-2 text-center">
                            <h2 className="text-2xl font-bold text-center">Users</h2>
                            {results.users.map(user => (
                                <li key={user._id}
                                    className="flex items-center bg-gray-800 rounded-lg p-4 mb-2 hover:bg-gray-700 transition duration-300 ease-in-out">
                                    <img
                                        src={user.avatarUrl || 'https://via.placeholder.com/150'}
                                        alt="avatar"
                                        className="w-16 h-16 rounded mr-4"
                                    />
                                    <div className='w-full'>
                                        <div className="flex-grow mb-2">
                                            <div className="text-lg font-semibold flex items-center">
                                                <Link className="underline"
                                                      to={`/user/${user._id}`}>{user.username}</Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {results.songs?.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mt-6 text-center">Songs</h2>
                            <SongList songs={results.songs} />
                        </div>
                    )}

                    {results.playlists?.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold mt-6 text-center">Playlists</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {results.playlists.map(playlist => (
                                    <div key={playlist._id} className="p-4 bg-gray-800 rounded-lg">
                                        <div className='w-full'>
                                            <img className="h-[204px] w-full object-cover rounded-lg"
                                                 src={playlist.coverUrl || 'https://via.placeholder.com/150'}/>
                                        </div>
                                        <h3 className="text-lg font-semibold">{playlist.name}</h3>
                                        <p>{playlist.description}</p>
                                        <Link to={`/playlist/${playlist._id}`}
                                              className="text-blue-500 hover:underline">View Playlist</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
