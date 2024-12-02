import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './authentication.css';
import { useNavigate } from 'react-router-dom';

function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    const authData = { email, password };
    const endpoint = isLogin ? '/login' : '/register';

    try {
        console.log('Sending request to backend...');
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authData),
      });
      console.log('Request sent, awaiting response...');

      const data = await response.json();
      console.log('Response data:', data);  //mitä saadaan backendiltä

      if (response.ok) {
        console.log('Response is OK. Proceeding with saving to localStorage...');

        // Puretaan JWT token
        if (data.token) {
            const decodedToken = jwtDecode(data.token);
            //Tarkistetaan että saadaan ID tokenista
          console.log('Decoded Token:', decodedToken);

          // Tallennetaan arvot local storageen
          localStorage.setItem('authToken', data.token);  
          localStorage.setItem('user_id', decodedToken.userId); 
          localStorage.setItem('email', email); 
          console.log('User ID saved:', decodedToken.id);   // printataan id

        } else {
          console.error('No token received');
        }

        navigate('/profile');
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




