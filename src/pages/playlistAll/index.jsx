import React, { useEffect, useState } from "react";

import { useLocation } from 'react-router-dom'
import { PlaylistsCard } from "../../components/PlaylistCard";
import axiosInstance from "../../axios/axiosInstance";

const PlaylistAll = () => {

    const location = useLocation()
    const { type } = location.state;


    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const playlists = await axiosInstance.get("/api/playlists");
                setPlaylists(playlists.data);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };

        fetchPlaylists();

    }, []);

    return(
        <div className="min-h-screen">
            <div className="md:pl-72 pt-32">
                <div className="bg-black p-8 text-white">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-2xl font-bold text-white hover:underline">
                                {type}
                            </p>
                        </div>
                        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {playlists && playlists.map((playlist, index) => (
                                playlist.genre === type ? <PlaylistsCard
                                    key={playlist._id}
                                    id={playlist._id}
                                    title={playlist.title}
                                    description={playlist.description}
                                    imageUrl={playlist.coverUrl}
                                /> : null
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaylistAll;