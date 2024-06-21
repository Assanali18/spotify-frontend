import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import { PlaylistsCard } from "../PlaylistCard";

export const PlaylistSection = () => {
  const [playlists, setPlaylists] = useState({ Popular: [], ForYou: [], HipHop: [], Other: [] });

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axiosInstance.get("/api/playlists");
        const playlistsData = response.data;
        const categorizedPlaylists = {
          'Popular': [],
          'For you': [],
          'Hip-Hop': [],
          'Other': []
        };

        playlistsData.forEach((playlist) => {
          if (categorizedPlaylists[playlist.genre]) {
            categorizedPlaylists[playlist.genre].push(playlist);
          }
        });

        setPlaylists(categorizedPlaylists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  return (
      <div className="mb-8">
        {Object.keys(playlists).map((genre) => (
            <div key={genre}>
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="text-2xl font-bold text-white hover:underline">
                  {genre}
                </Link>
                {playlists[genre].length > 6 && (
                    <Link
                        to="/playlist"
                        state={{ type: genre }}
                        className="text-sm font-bold tracking-[2px] hover:underline">
                      Show all
                    </Link>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {playlists[genre].slice(0, 6).map((playlist) => (
                    <PlaylistsCard
                        id = {playlist._id}
                        key={playlist._id}
                        title={playlist.name}
                        description={playlist.description || "No description available."}
                        imageUrl={playlist.coverUrl}
                    />
                ))}
              </div>
            </div>
        ))}
      </div>
  );
};

export default PlaylistSection;
