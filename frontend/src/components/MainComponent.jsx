import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainComponent.css';

const MainComponent = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="main-container">
      <h1 className="main-title">IMAGE PROCESSOR</h1>
      <h2 className="main-subtitle">GENERATE, ANALYZE & COMPARE YOUR IMAGES</h2>
      <button className="cta-button" onClick={handleGetStarted}>
        Get Started
      </button>
      <div className="footer">
        © 2024 Image Processor Inc. All rights reserved.
      </div>
    </div>
  );
};

export default MainComponent;
