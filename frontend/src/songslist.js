import React from "react";
import { Link } from "react-router-dom";

import image1 from './Images/ae dil hai mushkil.jpg';
import image2 from './Images/Attention.jpg';
import image3 from './Images/dil diyan gallan.jpg';
import image4 from './Images/lover.jpg';
import image5 from './Images/middle of the night.jpg';
import image6 from './Images/nashe se chad gayi.jpg';
import image7 from './Images/perfect.jpg';
import image8 from './Images/shape of you.jpg';
import image9 from './Images/tareefan.jpg';
import image10 from './Images/tera ban jaunga.jpg';

const SongList = () => {
  const englishSongs = [
    {title: 'Attention',  image: image2 },
    {title: 'Lover', image: image4 },
    {title: 'Middle of the Night',  image: image5 },
    {title: 'Perfect', image: image7 },
    {title: 'Shape of You',image: image8 },
  ];
  const hindiSongs = [
    {title: 'Ae Dil Hai Mushkil', image: image1 },
    {title: 'Dil Diyan Gallan', image: image3 },
    {title: 'Nashe Si Chadh Gayi',  image: image6 },
    {title: 'Tareefan',  image: image9 },
    {title: 'Tera Ban Jaunga', image: image10 },
  ];

  return (
    <div className="container mx-auto">
      <h1 className="pt-5 px-5 text-3xl font-bold text-left my-8 text-white"></h1>
      <div className="flex flex-wrap justify-center">
        {englishSongs.map((song) => (
          <div key={song.title} className="m-4 max-w-sm rounded overflow-hidden shadow-lg">
            <Link to={`/songs/${song.title}`} className="block cursor-pointer">
              <img src={song.image} alt={song.title} className="w-full h-64 object-cover" />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-white">{song.title}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center">
        {hindiSongs.map((song) => (
          <div key={song.title} className="m-4 max-w-sm rounded overflow-hidden shadow-lg">
            <Link to={`/songs/${song.title}`} className="block cursor-pointer">
              <img src={song.image} alt={song.title} className="w-full h-64 object-cover" />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-white">{song.title}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList;

