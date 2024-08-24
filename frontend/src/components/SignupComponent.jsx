import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [verifyMessage, setVerifyMessage] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const inputSignup = {
      name,
      email,
      password,
      action: "/signup"
    };

    const paramsSignup = {
      input: JSON.stringify(inputSignup),
      stateMachineArn: 'arn:aws:states:us-east-1:761577439658:stateMachine:authentication'
    };

    try {
      const response = await axios.post('https://fhd73czqfa.execute-api.us-east-1.amazonaws.com/signup', {
        name: name,
        email: email,
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setMessage(response.data.message);
      console.log(response);
      setVerificationRequired(true);
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerifyError(null);
    setVerifyMessage(null);

    const inputVerify = {
      email,
      confirmation_code: code,
      action: "/verify"
    };

    const paramsVerify = {
      input: JSON.stringify(inputVerify),
      stateMachineArn: 'arn:aws:states:us-east-1:761577439658:stateMachine:authentication'
    };

    try {
      const response = await axios.post('https://xckp6yia6e.execute-api.us-east-1.amazonaws.com/dev/verify', paramsVerify, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setVerifyMessage("Verification done");
      navigate('/');
    } catch (error) {
      setVerifyError(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!verificationRequired ? (
        <>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Sign Up</button>
          </form>
          {loading && <div>Signing up...</div>}
          {error && <div>{error}</div>}
          {message && <div>{message}</div>}
        </>
      ) : (
        <>
          <h2>Verify Your Email</h2>
          <form onSubmit={handleVerify}>
            <div>
              <label htmlFor="code">Verification Code:</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button type="submit">Verify</button>
          </form>
          {loading && <div>Verifying...</div>}
          {verifyError && <div>{verifyError}</div>}
          {verifyMessage && <div>{verifyMessage}</div>}
        </>
      )}
    </div>
  );
};

export default SignupComponent;
