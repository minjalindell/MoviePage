import React, { useState } from 'react';
import axios from 'axios';  
import './register.css'; 

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    if (!email || !password) {
      setError('Email and password are necessary');
      return;
    }

    if (!validatePassword(password)) {
      setError('The password must be at least 8 characters long, contain at least one uppercase letter, and one number.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/register', {
        email,
        password,
      });
      setSuccessMessage('Registeration succesfull!');
      setEmail('');
      setPassword('');
      setError(''); 
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong:(');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
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
      </div>
    </div>
  );
}

export default Register;


