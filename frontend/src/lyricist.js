import React, { useState, useEffect } from "react";
import axios from "axios";
import PlaylistCard from './components/playlistcard';

const Lyricist= () => {
  const [songs, setSongs] = useState([]);
  const [lyricist, setLyricist] = useState("Charlie Puth"); // Default composer

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/songs/lyricist/${lyricist}`);
        setSongs(response.data.songs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [lyricist]);

  return (
    <div style={{ color: 'white', padding: '80px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="lyricistSelect" style={{ color: 'white', marginRight: '10px' }}>Select Lyricist: </label>
        <select
          id="lyricistSelect"
          value={lyricist}
          onChange={(e) => setLyricist(e.target.value)}
          style={{ color: 'white', backgroundColor: '#333', padding: '8px', borderRadius: '5px', border: 'none' }} 
        >
          <option value="Charlie Puth" style={{ color: 'white' }}>Charlie Puth</option>
          <option value="Taylor Swift" style={{ color: 'white' }}>Taylor Swift</option>
          <option value="The Vamps" style={{ color: 'white' }}>The Vamps</option>
          <option value="Ed Sheeran" style={{ color: 'white' }}>Ed Sheeran</option>
          <option value="Amitabh Bhattacharya" style={{ color: 'white' }}>Amitabh Bhattacharya</option>
          <option value="Irshad Kamil" style={{ color: 'white' }}>Irshad Kamil</option>
          <option value="Jaideep Sahni" style={{ color: 'white' }}>Jaideep Sahni</option>
          <option value="Qaran" style={{ color: 'white' }}>Qaran</option>
          <option value="Kumaar" style={{ color: 'white' }}>Kumaar</option>
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

export default Lyricist;

