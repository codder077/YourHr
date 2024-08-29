import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated }) => {
    const userId = isAuthenticated ? JSON.parse(localStorage.getItem('auth')).userId : null;

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-xl font-bold">Home</Link>
                <div className="space-x-4">
                    <Link to="/about" className="text-white">About</Link>
                    {!isAuthenticated ? (
                        <Link to="/signup" className="text-white">Sign Up</Link>
                    ) : (
                        <Link to={`/profile/${userId}`} className="text-white">Profile</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
