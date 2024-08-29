import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background.webp'; // Replace with your actual image path

const HomePage = ({ isAuthenticated }) => {
    const userId = isAuthenticated ? JSON.parse(localStorage.getItem('auth')).userId : null;

    return (
        <div
            className="container mx-auto p-8 min-h-screen flex flex-col justify-center items-center relative"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black opacity-40"></div>

            {/* Content */}
            <div className="relative z-10 text-center">
                <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">Welcome to YourHR</h1>
                <p className="text-lg text-gray-200 mb-8 drop-shadow-md">
                    {isAuthenticated
                        ? "Explore your opportunities and manage your profile with ease."
                        : "Find the perfect job based on your qualifications and preferences. Sign up to get started!"
                    }
                </p>
                {!isAuthenticated ? (
                    <div className="flex justify-center">
                        <Link to="/signup" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105">
                            Get Started
                        </Link>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Link to={`/profile/${userId}`} className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105">
                            Go to Your Profile
                        </Link>
                    </div>
                )}
                <div className="mt-12">
                    <h2 className="text-3xl text-white font-semibold mb-4 drop-shadow-lg">Why Choose YourHR?</h2>
                    <ul className="text-lg text-gray-200 space-y-4">
                        <li className="transition-all transform hover:scale-105">✔️ Tailored job recommendations</li>
                        <li className="transition-all transform hover:scale-105">✔️ Easy profile management</li>
                        <li className="transition-all transform hover:scale-105">✔️ Secure and reliable</li>
                        <li className="transition-all transform hover:scale-105">✔️ Get started in just a few clicks</li>
                    </ul>
                </div>
                <div className="mt-16">
                    <h2 className="text-3xl text-white font-semibold mb-4 drop-shadow-lg">What Our Users Say</h2>
                    <div className="text-lg text-gray-200 space-y-8">
                        <p className="italic">"YourHR helped me find my dream job in just a few weeks!"</p>
                        <p className="italic">"The platform is so easy to use, and the recommendations are spot on."</p>
                        <p className="italic">"I love how I can manage my profile and applications all in one place."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
