import React, { useState } from 'react';
import './login.css';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Onnistui
        localStorage.setItem('authToken', data.token);
        setSuccessMessage('Login successful!');
        setErrorMessage('');
        navigate('/profile');
      } else {
        // Epäonnistui
        setErrorMessage(data.message || 'Login failed');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Error in login');
      setSuccessMessage('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Log in</h2>
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
          <button type="submit">Log in</button>
          <Link to="/register" className="nav-link">
                  <button className="button">No account? Register here!</button>
                </Link>
        </form>
        
       
        {successMessage && <p className="success-message">{successMessage}</p>}
        
    
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Login;