import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from './components/card';
import Feedback from './components/feedback';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import music1 from './Songs/Ae dil hai mushkil.mp3';
import music2 from './Songs/Attention.mp3';
import music3 from './Songs/Dil Diyan Gallan.mp3';
import music4 from './Songs/Lover.mp3';
import music5 from './Songs/MIDDLE OF THE NIGHT.mp3';
import music6 from './Songs/Nashe Si Chadh Gayi.mp3';
import music7 from './Songs/Perfect.mp3';
import music8 from './Songs/Shape of You.mp3';
import music9 from './Songs/Tareefan.mp3';
import music10 from './Songs/Tera Ban Jaunga.mp3';

const SongDetail = () => {
  const { title } = useParams();
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [userId, setUserId] = useState(null); 
  const [isAddedToPlaylist, setIsAddedToPlaylist] = useState(false); 

  const songs = {
    'Ae Dil Hai Mushkil': music1,
    'Attention': music2,
    'Dil Diyan Gallan': music3, 
    'Lover': music4, 
    'Middle of the Night': music5,
    'Nashe Si Chadh Gayi': music6,
    'Perfect': music7,
    'Shape of You': music8,
    'Tareefan': music9,
    'Tera Ban Jaunga': music10,
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/login');
        const userData = response.data;
        if (userData && userData.user_ids && userData.user_ids.length > 0) {
          setUserId(userData.user_ids[0]); // Assuming there's only one user ID
        } else {
          throw new Error('User ID not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      }
    };

    const fetchSong = async () => {
      try {
        await fetchUserData(); 
        const response = await fetch(`http://localhost:5000/songs/${title}`);
        if (!response.ok) {
          throw new Error('Failed to fetch song');
        }
        const data = await response.json();
        setSong(data.song);
      } catch (error) {
        console.error('Error fetching song:', error);
        setError('Failed to fetch song');
      }
    };

    if (title) {
      fetchSong();
    }
  }, [title]);

  const handleSubmitFeedback = async () => {
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }
      await axios.post(
        'http://localhost:5000/feedback',
        {
          feedback,
          song_title: title,
          song_name: song.SongName,
          user_id: userId
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Feedback recorded successfully!');
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again later.');
    }
  };
  
  const handleHeartClick = async (songId) => {
    try {
      if (!userId) {
        throw new Error('User ID not found');
      }
  
      // Check if the song is already in the playlist
      const response = await axios.get(`http://localhost:5000/playlist/${userId}/${songId}`);
      const isInPlaylist = response.data.isInPlaylist;
  
      if (isInPlaylist) {
        // If the song is already in the playlist, remove it
        await axios.post(
          'http://localhost:5000/playlist/remove',
          { user_id: userId, song_id: songId, song_title:title},
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        toast.info('Song removed from playlist!');
      } else {
        // If the song is not in the playlist, add it
        await axios.post(
          'http://localhost:5000/playlist/add',
          { user_id: userId, song_id: songId, song_title:title },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        toast.success('Song added to playlist!');
      }
      setIsAddedToPlaylist(!isInPlaylist); // Toggle the state based on whether the song was already in the playlist
    } catch (error) {
      console.error('Failed to update playlist:', error);
      toast.error('Failed to update playlist. Please try again later.');
    }
  };
  
  

  if (error) {
    return <div className='text-white'> Error: {error}</div>;
  }

  if (!song) {
    return <div>Loading...</div>;
  }

  return (
    <div className='text-white' style={{ display: 'flex' }}>
      <div style={{ marginRight: '20px' }}>
        <Card
          songname={song.SongName}
          language={song.Language}
          genre={song.Genre}
          artist={song.Artist}
          lyricist={song.Lyricist}
          composer={song.Composer}
          album={song.Album}
          duration={song.Duration}
          songUrl={songs[song.SongName]}
          songId={song.SongId}
          userId={userId}
          isAddedToPlaylist={isAddedToPlaylist}
          onHeartClick={handleHeartClick}
        />
      </div>
      <div style={{ marginRight: '20px' }}>
        <Feedback setFeedback={setFeedback} handleSubmitFeedback={handleSubmitFeedback}/>
        <ToastContainer theme="dark" />
      </div>
    </div>
  );
};

export default SongDetail;
