import React, { useState, useContext } from 'react';
import { UserContext } from './context/userContext';
import './authentication.css';
import { useNavigate } from 'react-router-dom';

function Authentication() {
  const { signIn, signUp } = useContext(UserContext); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authData = { email, password };

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    console.log('Submitting:', authData); 
  
    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(email, password);
        setIsLogin(true);
      }
      setEmail('');
      setPassword('');
      setIsLogin(true);
      
    } catch (error) {
      console.error('Virhe kirjautumisessa/rekisteröinnissä:', error);
      // Tarkista, onko palvelin palauttanut virheviestin
      const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
      setErrorMessage(message);
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
          {!isLogin && ( 
            <>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </>
          )}
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








