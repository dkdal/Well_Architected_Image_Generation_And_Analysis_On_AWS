import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './LoginComponent.css';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // For sign-up
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true); // State to switch between login and signup
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input = {
      username: username,
      password: password,
      action: "/login"
    };

    const params = {
      input: JSON.stringify(input),
      stateMachineArn: 'arn:aws:states:us-east-1:761577439658:stateMachine:authentication'
    };

    try {
      const response = await axios.post('https://xckp6yia6e.execute-api.us-east-1.amazonaws.com/dev/login', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Response", response);
      login();
      navigate('/generate');
    } catch (error) {
      console.log("ERROR", error);
      console.log("ERROR RESPONSE", error.response);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input = {
      username: username,
      email: email,
      password: password,
      action: "/signup"
    };

    const params = {
      input: JSON.stringify(input),
      stateMachineArn: 'arn:aws:states:us-east-1:761577439658:stateMachine:authentication'
    };

    try {
      const response = await axios.post('https://xckp6yia6e.execute-api.us-east-1.amazonaws.com/dev/signup', params, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Response", response);
      // Handle post-signup logic (e.g., redirect to verification page)
    } catch (error) {
      console.log("ERROR", error);
      console.log("ERROR RESPONSE", error.response);
      const errorMessage = error.response?.data?.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="tabs">
          <button className={`tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>
        {isLogin ? (
          <div>
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Email:</label>
                <input
                  type="email"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">Login</button>
            </form>
            {loading && <div className="loading">Logging in...</div>}
            {error && <div className="error">{error}</div>}
          </div>
        ) : (
          <div>
            <h2 className="login-title">Sign Up</h2>
            <form onSubmit={handleSignup} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">Sign Up</button>
            </form>
            {loading && <div className="loading">Signing up...</div>}
            {error && <div className="error">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginComponent;
