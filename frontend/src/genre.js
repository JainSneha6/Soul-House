import React, { useState, useEffect } from "react";
import axios from "axios";
import PlaylistCard from './components/playlistcard';

const Album = () => {
  const [songs, setSongs] = useState([]);
  const [genre, setGenre] = useState("Pop"); 

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/songs/genre/${genre}`);
        setSongs(response.data.songs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [genre]);

  return (
    <div style={{ color: 'white', padding: '80px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="genreSelect" style={{ color: 'white', marginRight: '10px' }}>Select Genre: </label>
        <select
          id="genreSelect"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ color: 'white', backgroundColor: '#333', padding: '8px', borderRadius: '5px', border: 'none' }} 
        >
          <option value="Pop" style={{ color: 'white' }}>Pop</option>
          <option value="Romantic" style={{ color: 'white' }}>Romantic</option>
          <option value="Party" style={{ color: 'white' }}>Party</option>
        </select>
      </div>
      <ul style={{ paddingLeft: '20px' }}>
        {songs.map((song, index) => (
          <PlaylistCard key={index} song_title={song.SongName}/>
        ))}
      </ul>
    </div>
  );
};

export default Album;

