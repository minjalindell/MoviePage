import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('Password must be at least 8 characters long and contain at least one uppercase letter and one number.');
      return;
    }

    const registerData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        localStorage.setItem('authToken', data.token); // Store token in localStorage
        setSuccessMessage('Registration successful!');
        setErrorMessage('');
        setEmail('');
        setPassword('');
        navigate('/profile'); // Redirect to profile
      } else {
        // Registration failed
        setErrorMessage(data.message || 'Registration failed');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Error in registration');
      setSuccessMessage('');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
        
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Register;


