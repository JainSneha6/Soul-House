import React, { useState, useEffect } from "react";
import axios from "axios";
import PlaylistCard from './components/playlistcard';

const Album = () => {
  const [songs, setSongs] = useState([]);
  const [album, setAlbum] = useState("Ae Dil Hai Mushkil"); // Default composer

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/songs/album/${album}`);
        setSongs(response.data.songs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [album]);

  return (
    <div style={{ color: 'white', padding: '80px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="albumSelect" style={{ color: 'white', marginRight: '10px' }}>Select Album: </label>
        <select
          id="albumSelect"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          style={{ color: 'white', backgroundColor: '#333', padding: '8px', borderRadius: '5px', border: 'none' }} 
        >
          <option value="Voicenotes" style={{ color: 'white' }}>Voicenotes</option>
          <option value="Lover" style={{ color: 'white' }}>Lover</option>
          <option value="Night & Day" style={{ color: 'white' }}>Night & Day</option>
          <option value="Divide" style={{ color: 'white' }}>Divide</option>
          <option value="Ae Dil Hai Mushkil" style={{ color: 'white' }}>Ae Dil Hai Mushkil</option>
          <option value="Tiger Zinda Hai" style={{ color: 'white' }}>Tiger Zinda Hai</option>
          <option value="Befikre" style={{ color: 'white' }}>Befikre</option>
          <option value="Veere Di Wedding" style={{ color: 'white' }}>Veere Di Wedding</option>
          <option value="Kabir Singh" style={{ color: 'white' }}>Kabir Singh</option>
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

