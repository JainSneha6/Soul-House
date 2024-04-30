import React from "react";
import { Link } from "react-router-dom";
import { FiGlobe, FiMusic, FiUser, FiBook, FiMic, FiDisc } from 'react-icons/fi';

const Filter = () => {
    return (
        <div className="flex flex-col items-center mt-6">
            <Link to="/language" className="text-white font-bold text-3xl hover:text-gray-600 flex items-center mb-8">
                <FiGlobe className="mr-2" /> Language
            </Link>
            <Link to="/composer" className="text-white font-bold text-3xl hover:text-gray-600 flex items-center mb-8">
                <FiBook className="mr-2" /> Composer
            </Link>
            <Link to="/artist" className="text-white font-bold text-3xl hover:text-gray-600 flex items-center mb-8">
                <FiUser className="mr-2" /> Artist
            </Link>
            <Link to="/album" className="text-white font-bold text-3xl hover:text-gray-600 flex items-center mb-8">
                <FiDisc className="mr-2" /> Album
            </Link>
            <Link to="/genre" className="text-white font-bold text-3xl hover:text-gray-600 flex items-center mb-8">
                <FiMusic className="mr-2" /> Genre
            </Link>
            <Link to="/lyricist" className="text-white font-bold text-3xl hover:text-gray-600 flex items-center">
                <FiMic className="mr-2" /> Lyricist
            </Link>
        </div>
    );
};

export default Filter;


