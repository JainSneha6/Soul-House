import React, { useState, useRef } from 'react';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';
import styles from './styles.module.css';

const Card = ({ songname, language, genre, artist, lyricist, composer, album, duration, songUrl, songId, userId, isAddedToPlaylist, onHeartClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlayButtonClick = () => {
    setIsPlaying(true);
    audioRef.current.play();
  };

  const handlePauseButtonClick = () => {
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const handleHeartClick = () => {
    onHeartClick(songId);
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <h1 style={{ fontSize: '28px', textAlign:'center'}}>{songname}</h1>
        <h3 style={{ fontSize: '24px', marginBottom: '20px', textAlign:'center'}}>{artist} - {album}</h3>
        <div style={{ fontSize: '20px', marginBottom: '20px' }}>
          <p>
            <span style={{ fontWeight: 'bold' }}>Language:</span> {language}<br />
            <span style={{ fontWeight: 'bold' }}>Genre:</span> {genre}<br />
            <span style={{ fontWeight: 'bold' }}>Lyricist:</span> {lyricist}<br />
            <span style={{ fontWeight: 'bold' }}>Composer:</span> {composer}<br />
            <span style={{ fontWeight: 'bold' }}>Duration:</span> {duration}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', top: 350, right: 30 }}>
          <audio ref={audioRef} src={songUrl} type="audio/mp3" />

          {!isPlaying ? (
            <FaPlay className="play-icon" onClick={handlePlayButtonClick} style={{ marginRight: '10px' }} />
          ) : (
            <FaPause className="pause-icon" onClick={handlePauseButtonClick} style={{ marginRight: '10px' }} />
          )}
          
          <FaHeart
            className="heart-icon"
            onClick={handleHeartClick}
            style={{ color: isAddedToPlaylist ? 'inherit' : 'inherit' }}
          />
        </div>
        <div className={styles.layers}>
          {[...Array(10)].map((_, index) => (
            <div key={index} className={styles.layer} style={{ '--tz': `${(index + 1) * -4}px` }}></div>
          ))}
          <div className={styles.layer} style={{ boxShadow: '0 0 0.5em #000d inset, 0 0 5px #000' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Card;