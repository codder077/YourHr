// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    const isAuthenticated = Boolean(authData && authData.token);

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/profile" />} />
                    <Route path="/profile/:userId" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/signup" />} />
                    <Route path="*" element={<Navigate to="/" />} /> {/* Fallback route */}
                </Routes>
            </main>
            <Footer />
        </Router>
    );
};

export default App;
