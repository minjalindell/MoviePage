import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./userContext.js";

const url = 'http://localhost:3001'

export default function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { email: '', token: '' };
  });

  // signIn-metodi, joka hoitaa käyttäjän kirjautumisen
  const signIn = async (email, password) => {
    try {
      console.log('Attempting to sign in with:', { email, password });  
      const response = await axios.post(`${url}/user/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Sign-in response:', response);
      const { token, userData } = response.data;

      if (token) {
        sessionStorage.setItem('user', JSON.stringify({ token, ...userData }));
        setUser({ token, ...userData });
        console.log('User signed in:', { token, ...userData });
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Sign-in failed';
      throw errorMessage;
    }
  };

  // signUp-metodi, joka hoitaa käyttäjän rekisteröinnin
  const signUp = async (email, password) => {
    try {
      const response = await axios.post(`${url}/user/register`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('User signed up successfully', response.data);
    } catch (error) {
      console.error('Sign-up error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Sign-up failed';
      throw errorMessage;
    }
  };

  // signOut-metodi, joka hoitaa käyttäjän uloskirjautumisen
  const signOut = () => {
    sessionStorage.removeItem('user'); // Poistaa käyttäjän tiedot sessionStorage:sta
    setUser({ email: '', token: '' }); // Nollaa käyttäjän tilan
  };

  // Päivitetään käyttäjän tila, jos käyttäjän tiedot löytyvät sessionStorage:sta
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Ladataan käyttäjän tiedot sessionStorage:sta
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, signIn, signUp, signOut }}>
      {children}
    </UserContext.Provider>
  );
}