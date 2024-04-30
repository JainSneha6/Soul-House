import {React,useState,useEffect} from 'react';
import styles from './styles.module.css';
import {Link} from 'react-router-dom'

const PlaylistCard = ({song_title} ) => {

  return (
    <div className={styles.cardContainer}> 
      <div className={styles.card} style={{ height: '100px', width: '650px', marginTop: '60px', marginLeft: '70px' }}>
        <div style={{ marginBottom: '40px' }}>
        <Link to={`/songs/${song_title}`}><h1 style={{ fontSize: '28px', textAlign: 'center' }}>{song_title}</h1></Link>
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

export default PlaylistCard;

