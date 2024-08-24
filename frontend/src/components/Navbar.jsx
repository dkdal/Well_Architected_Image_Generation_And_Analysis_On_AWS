import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">ImGAC</Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/generate" className="navbar-link">Image Generator</Link>
          </li>
          <li className="navbar-item">
            <Link to="/analyze" className="navbar-link">Analyze</Link>
          </li>
          <li className="navbar-item">
            <Link to="/upload" className="navbar-link">Compare</Link>
          </li>
          <li className="navbar-item">
            <Link to="/fetchAll" className="navbar-link">Image Gallery</Link>
          </li>
          {isAuthenticated ? (
            <li className="navbar-item">
              <button onClick={logout} className="navbar-button">Logout</button>
            </li>
          ) : (
            <li className="navbar-item">
              <Link to="/login" className="navbar-link">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
