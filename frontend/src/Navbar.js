import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; 

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userCredentials, setUserCredentials] = useState({ email: '', password: '' });

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get('http://localhost:5000/login');
        const user_ids = response.data.user_ids;
        if (user_ids.length > 0) {
          setIsLoggedIn(true);
          const userCredentialsResponse = await axios.get(`http://localhost:5000/user-credentials`);
          const users = userCredentialsResponse.data.users;
          if (users && users.length > 0) {
            setUserCredentials(users[0]);
            console.log(users[0]);
          } else {
            console.error("No user credentials found");
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
  
    checkLoggedIn();
  }, []);
  

  const handleLogout = async () => {
    try {
      console.log(userCredentials); 
      const response = await axios.post('http://localhost:5000/logout', userCredentials);
        console.log(response.data);
        setIsLoggedIn(false); 
        setTimeout(() => {
          navigate("/");
        }, 3000);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0}} className="text-white-400 bg-000215 body-font">
      <div className="container flex flex-wrap p-5 ">
        <div className="md:flex items-center">
          <nav className="hidden md:flex flex-wrap items-center text-base">
            <Link to="/" className="mr-10 text-white font-bold text-xl hover:text-gray-600">Home</Link>
            <Link to="/songs" className="mr-10 text-white font-bold text-xl hover:text-gray-600">Songs</Link>
            <Link to="/filter" className="mr-10 text-white font-bold text-xl hover:text-gray-600">Filter</Link>
            <Link to="/playlist" className="mr-10 text-white font-bold text-xl hover:text-gray-600">Playlist</Link>
            {!isLoggedIn && <Link to="/signup" className="mr-10 text-white font-bold text-xl hover:text-gray-600">SignUp</Link>}
            {!isLoggedIn && <Link to="/login" className="mr-10 text-white font-bold text-xl hover:text-gray-600">Login</Link>}
            {isLoggedIn && <button onClick={handleLogout} className="mr-10 text-white font-bold text-xl hover:text-gray-600">Logout</button>}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
