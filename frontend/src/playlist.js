import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaylistCard from './components/playlistcard';

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get('http://localhost:5000/playlist/add');
        setPlaylist(response.data.users || []);
      } catch (error) {
        console.error('Error fetching playlist:', error);
        // Handle error
      }
    };

    fetchPlaylist();
  }, []);

  return (
    <div style={{ color: 'white' }}>
      {playlist.length > 0 ? (
        playlist.map((item, index) => (
          <PlaylistCard key={index} song_title={item.song_title}/>
        ))
      ) : (
        <p>No songs in the playlist</p>
      )}
    </div>
  );
};

export default Playlist;
