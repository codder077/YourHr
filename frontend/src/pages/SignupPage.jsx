import { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            if (file) {
                formDataToSend.append('resume', file);
            }

            const response = await axios.post('http://localhost:5000/signup', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                const userId = response.data.userId;
                localStorage.setItem('auth', JSON.stringify({
                    token: response.data.token,
                    userId: response.data.userId,
                    name: response.data.name,
                    email: response.data.email,
                }));
                navigate(`/profile/${userId}`);
            }
        } catch (error) {
            console.error('Signup failed:', error);
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-3xl font-semibold text-center mb-6">Sign Up</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-2 p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-2 p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full mt-2 p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Resume</label>
                    <input type="file" name="resume" onChange={handleFileChange} className="w-full mt-2 p-2 border rounded" required />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
