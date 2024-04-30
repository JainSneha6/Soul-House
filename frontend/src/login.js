import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      setTimeout(() => {
        navigate("/");
      }, 3000);
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="bg-000215 min-h-screen bg-cover bg-center flex flex-wrap-row items-center justify-center" >
      <div className="w-full max-w-md p-6 md:p-8 bg-white border-black-300 shadow-2xl bg-opacity-50 relative h-[65vh]">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="mt-4 text-2xl font-bold text-black">Login to your account</h2>
        </div>
        <form className="space-y-4 md:space-y-6 pl-4" action="#" method="POST">


          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-1 text-black">
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.0 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-1 text-black">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="block w-full rounded-md border-0 py-1.0 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>


          <div>
            <button 
              type="submit" onClick={handleSubmit}
              className="flex w-full justify-center rounded-md pl-4 bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>
            <ToastContainer theme="dark" />
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-black">
          Not a member?{' '}
          <Link to="/signup" className="font-semibold leading-6 text-black hover:text-blue-900 focus:outline-none">
            Sign up
          </Link>
        </p>
      </div>

      <div className="w-full -m-1/2 max-w-lg p-6 md:p-8 bg-blue-900 border-black-300 shadow-2xl bg-opacity-50 relative h-[65vh]  hidden md:block">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-white text-6xl font-bold mb-8 ml-15 text-center">Welcome Back!</h1>
      </div>
      </div>
    </div>
  );
};

export default Login;
