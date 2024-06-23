import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArtistsCard } from "../ArtistsCard";
import "./Artistsection.css";

export const Artistsection = ({ title }) => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {

    const fetchArtists = async () => {
      try {
        const response = await fetch('/api/most-popular');
        const data = await response.json();
        setArtists(data);
        console.log(artists)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchArtists();
  }, []);

  return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-2xl font-bold text-white hover:underline">
            Popular artists
          </Link>
          <Link
              to="/"
              className="text-sm font-bold tracking-[2px] hover:underline"
          >
            Show all
          </Link>
        </div>
        <div className="horizontal-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {artists.map((artist, index) => (
              <ArtistsCard
                  key={index}
                  title={artist.name}
                  description={`Likes: ${artist.totalLikes}`}
                  artistId={artist._id}
                  imageUrl={artist.imageUrl}
              />
          ))}
        </div>
      </div>
  );
};
