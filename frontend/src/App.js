import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainComponent from './components/MainComponent';
import LoginComponent from './components/LoginComponent';
import SignupComponent from './components/SignupComponent';
import ImageGenerator from './components/ImageGenerator';
import ImageGallery from './components/ImageGallery';
import ImageUploader from './components/ImageUploader';
import ImageAnalyzer from './components/ImageAnalyzer';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<MainComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="/generate" element={<ProtectedRoute element={<ImageGenerator />} />} />
            <Route path="/fetchAll" element={<ProtectedRoute element={<ImageGallery />} />} />
            <Route path="/analyze" element={<ProtectedRoute element={<ImageAnalyzer />} />} />
            <Route path="/upload" element={<ProtectedRoute element={<ImageUploader />} />} />
            <Route path="/compare" element={<ProtectedRoute element={<ImageGenerator />} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
