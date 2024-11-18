import React, { useState } from 'react';
import axios from 'axios';  // Axios käytetään HTTP-pyyntöihin
import './register.css'; // Liitetään CSS-tiedosto

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/register', {
        email,
        password,
      });
      setSuccessMessage('Rekisteröinti onnistui!');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Jokin meni pieleen');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Rekisteröidy</h2>
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
            <label>Salasana:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Rekisteröidy</button>
        </form>
      </div>
    </div>
  );
}

export default Register;

