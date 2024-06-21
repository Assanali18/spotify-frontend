import React, {useEffect, useState} from "react";
import { io } from 'socket.io-client';
import axiosInstance from "../../axios/axiosInstance";
import {Link} from "react-router-dom";

export default function UsersActivity() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const socket = io(`https://spotify-production-f726.up.railway.app`);

    const fetchUsers = async () => {
      const fetchedUsers = await axiosInstance.get('/api/users')
      // console.log(fetchedUsers)
      if(fetchedUsers){
        setUsers(fetchedUsers.data.map(user => ({ ...user, currentTrack: null })));
      }
    };

    socket.on('trackUpdated', (data) => {
      setUsers(users => users.map(user =>
          user._id === data.userId ? { ...user, currentTrack: data.track, artist: data.artist } : user
      ));
    });

    fetchUsers();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
      <div className="border-t border-gray-700 mt-8 pt-4">
        <h4 className="text-white text-lg font-bold mb-4">Users Activity</h4>
        <div className="flex flex-col gap-y-4 overflow-y-auto" style={{maxHeight: '300px'}}>
          {users.map(user => (
              <div key={user._id}>
                <Link to={`/user/${user._id}`} className="text-white font-bold">{user.username}</Link>
                <p className="text-gray-400"> {user.currentTrack ? `${user.currentTrack} - ${user.artist}` : "Not playing"}</p>
              </div>
          ))}
        </div>
      </div>
  );
}
