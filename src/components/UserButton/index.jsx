import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/axiosInstance';
import { BiHeart, BiSolidHeart } from "react-icons/bi";

const LikeButton = ({ itemId, itemType }) => {
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await axiosInstance.get(`/api/${itemType}/${itemId}/like-status`);
                setLiked(response.data.liked);
            } catch (error) {
                console.error('Error fetching like status:', error);
            }
        };

        fetchLikeStatus();
    }, [itemId, itemType]);

    const handleLike = async () => {
        try {
            if (liked) {
                await axiosInstance.post(`/api/${itemType}/${itemId}/unlike`);
            } else {
                await axiosInstance.post(`/api/${itemType}/${itemId}/like`);
            }
            setLiked(!liked);
        } catch (error) {
            console.error('Error liking item:', error);
        }
    };

    return (
        <button onClick={handleLike}>
            {liked ? <BiSolidHeart size="2em" color="#65D46E" /> : <BiHeart size="2em" />}
        </button>
    );
};

export { LikeButton };
