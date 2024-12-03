import React, { useState, useContext } from 'react';
import { UserContext } from './context/userContext';
import './authentication.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function Authentication() {
  const { signIn } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = { email, password };
    const endpoint = isLogin ? '/login' : '/register';
  
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          const decodedToken = jwtDecode(data.token);
          signIn(data.token, decodedToken.userId, email);
          navigate('/profile');
        } else {
          console.error('No token received');
        }
      } else {
        setErrorMessage(data.message || 'An error occurred');
      }
    } catch (error) {
      setErrorMessage('Error in authentication');
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="authentication-container">
      <div className="authentication-form">
        <h2>{isLogin ? 'Log in' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Log in' : 'Register'}</button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="toggle-form">
          {isLogin ? (
            <p>Don't have an account? 
              <button onClick={() => setIsLogin(false)} className="toggle-button">Register</button>
            </p>
          ) : (
            <p>Already have an account? 
              <button onClick={() => setIsLogin(true)} className="toggle-button">Log in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Authentication;







