import React, { useState, useEffect } from "react";
import axios from "axios";
import PlaylistCard from './components/playlistcard';

const Composer = () => {
  const [songs, setSongs] = useState([]);
  const [composer, setComposer] = useState("Charlie Puth"); // Default composer

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/songs/composer/${composer}`);
        setSongs(response.data.songs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [composer]);

  return (
    <div style={{ color: 'white', padding: '80px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="composerSelect" style={{ color: 'white', marginRight: '10px' }}>Select Composer: </label>
        <select
          id="composerSelect"
          value={composer}
          onChange={(e) => setComposer(e.target.value)}
          style={{ color: 'white', backgroundColor: '#333', padding: '8px', borderRadius: '5px', border: 'none' }} 
        >
          <option value="Charlie Puth" style={{ color: 'white' }}>Charlie Puth</option>
          <option value="Taylor Swift, Jack Antonoff" style={{ color: 'white' }}>Taylor Swift</option>
          <option value="Taylor Swift, Jack Antonoff" style={{ color: 'white' }}>Jack Antonoff</option>
          <option value="The Vamps" style={{ color: 'white' }}>The Vamps</option>
          <option value="Ed Sheeran" style={{ color: 'white' }}>Ed Sheeran</option>
          <option value="Pritam" style={{ color: 'white' }}>Pritam</option>
          <option value="Vishal-Shekhar" style={{ color: 'white' }}>Vishal-Shekhar</option>
          <option value="Qaran" style={{ color: 'white' }}>Qaran</option>
          <option value="Akhil Sachdeva" style={{ color: 'white' }}>Akhil Sachdeva</option>
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

export default Composer;

