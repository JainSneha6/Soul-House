import React, { useState, useEffect } from "react";
import axios from "axios";
import PlaylistCard from './components/playlistcard';

const Language = () => {
  const [songs, setSongs] = useState([]);
  const [language, setLanguage] = useState("English"); 

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/songs/language/${language}`);
        setSongs(response.data.songs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [language]);

  return (
    <div style={{ color: 'white', padding: '80px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="languageSelect" style={{ color: 'white', marginRight: '20px' }}>Select Language: </label>
        <select
          id="languageSelect"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ color: 'white', backgroundColor: '#333', padding: '8px', borderRadius: '5px', border: 'none' }} 
        >
          <option value="English" style={{ color: 'white' }}>English</option>
          <option value="Hindi" style={{ color: 'white' }}>Hindi</option>
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

export default Language;
