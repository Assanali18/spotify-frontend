import SongsList from "../../components/SongList";
import React from "react";

export default function Library(){
    return(
        <div className="min-h-screen text-gray-300">
            <div className="bg-custom-section pt-28 md:pl-72 p-8">
                <p className="text-2xl pb-6 text-center">All songs</p>
                <SongsList songsUrl="/api/songs" />
            </div>
        </div>
    )
}