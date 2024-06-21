import axiosInstance from "../axios/axiosInstance";

class SongService{
    updateSong = async (songId, title, songFile, imageFile) => {
        const formData = new FormData();
        formData.append('title', title);
        if (songFile) formData.append('song', songFile);
        if (imageFile) formData.append('image', imageFile);

        try {
            const response = await axiosInstance.put(`/api/songs/${songId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating song:', error);
            throw error;
        }
    }


    deleteSong = async (songId) => {
        try {
            const response = await axiosInstance.delete(`/api/songs/${songId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting song:', error);
            throw error;
        }
    }
}

export default SongService;