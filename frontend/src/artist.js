import React, { useState, useEffect } from "react";
import axios from "axios";
import PlaylistCard from './components/playlistcard';

const Artist = () => {
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState("Charlie Puth"); 

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/songs/artist/${artist}`);
        setSongs(response.data.songs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [artist]);

  return (
    <div style={{ color: 'white', padding: '80px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="artistSelect" style={{ color: 'white', marginRight: '10px' }}>Select Artist: </label>
        <select
          id="artistSelect"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          style={{ color: 'white', backgroundColor: '#333', padding: '8px', borderRadius: '5px', border: 'none' }} 
        >
          <option value="Charlie Puth" style={{ color: 'white' }}>Charlie Puth</option>
          <option value="Taylor Swift" style={{ color: 'white' }}>Taylor Swift</option>
          <option value="The Vamps" style={{ color: 'white' }}>The Vamps</option>
          <option value="Ed Sheeran" style={{ color: 'white' }}>Ed Sheeran</option>
          <option value="Arijit Singh" style={{ color: 'white' }}>Arijit Singh</option>
          <option value="Atif Aslam" style={{ color: 'white' }}>Atif Aslam</option>
          <option value="Badshah" style={{ color: 'white' }}>Badshah</option>
          <option value="Akhil Sachdeva, Tulsi Kumar" style={{ color: 'white' }}>Akhil Sachdeva</option>
          <option value="Akhil Sachdeva, Tulsi Kumar" style={{ color: 'white' }}>Tulsi Kumar</option>
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

export default Artist;

