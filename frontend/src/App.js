import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './signup';
import Songs from './songslist';
import Navbar from './Navbar.js';
import HomePage from './homepage';
import SongPage from './songspage'; 
import Login from './login.js';
import Playlist from './playlist.js';
import Filter from './filter.js';
import Language from './language.js';
import Composer from './composer.js';
import Album from './album.js';
import Artist from './artist.js';
import Genre from './genre.js';
import Lyricist from './lyricist.js';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/songs' element={<Songs />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/filter' element={<Filter />} />
          <Route path='/language' element={<Language />} />
          <Route path='/composer' element={<Composer />} />
          <Route path='/artist' element={<Artist />} />
          <Route path='/album' element={<Album />} />
          <Route path='/genre' element={<Genre />} />
          <Route path='/lyricist' element={<Lyricist />} />
          <Route path='/songs/:title' element={<SongPage />} />
          <Route path='*' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

