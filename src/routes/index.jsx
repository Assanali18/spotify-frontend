import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/home";
import { Signup } from "../pages/signup";
import { Signin } from "../pages/singin";
import UploadSong from "../pages/uploadSong";
import UserProfile from "../pages/profile";
import EditSong from "../pages/editSong";
import EditProfile from "../pages/editProfile";
import Search from "../pages/search";
import PublicUserProfile from "../pages/publicUserProfile";
import ProtectedRoute from "../components/ProtectedRoute";
import Library from "../pages/library";
import CreatePlaylist from "../pages/createPlaylsit";
import PlaylistAll from "../pages/playlistAll";
import Playlist from "../pages/playlist";
import PlaylistPage from "../pages/playlist";
import FavoritePage from "../pages/favoritePage";
import {AudioPlayerProvider} from "../contexts/AudioPlayerContex";
export const RouteList = () => {
  return (
      <AudioPlayerProvider>
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="/upload" element={<UploadSong />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/editSong/:id" element={<EditSong />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/user/:userId" element={<PublicUserProfile />} />
        <Route
            path="/signup"
            element={
                <ProtectedRoute redirectTo="/">
                    <Signup />
                </ProtectedRoute>
            }
        />
        <Route
            path="/signin"
            element={
                <ProtectedRoute redirectTo="/">
                    <Signin />
                </ProtectedRoute>
            }
        />
        <Route path='/library' element={<Library/>} />
        <Route path='/upload/playlist' element={<CreatePlaylist/>} />
        <Route path='/playlist' element={<PlaylistAll/>} />
        <Route path='/playlist/:playlistId' element={<PlaylistPage/>} />
        <Route path='/favorites' element={<FavoritePage/>} />
    </Routes>
      </AudioPlayerProvider>
  );
};
