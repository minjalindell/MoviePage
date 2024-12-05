import { useState, useEffect } from "react";
import { UserContext } from "./userContext.js";
import axios from "axios";

const url = 'http://localhost:3001'

export default function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { email: '', token: '' };
  });


  const signIn = async (email, password) => {
    try {
      console.log('Attempting to sign in with:', { email, password });  
      const response = await axios.post(`${url}/user/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Sign-in response:', response);
      
      const { token } = response.data;
      if (token) {
        sessionStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        console.log('User signed in:', response.data);
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error.response?.data?.message || 'Sign-in failed';
    }
  };
  


  const signUp = async (email, password) => {
    try {
      await axios.post(`${url}/user/register`, { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('User signed up successfully');
    } catch (error) {
      console.error('Sign-up error:', error);
      throw error.response?.data?.message || 'Sign-up failed';
    }
  };

  const signOut = () => {
    sessionStorage.removeItem('user');
    setUser({ email: '', token: '' });
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, signIn, signUp, signOut }}>
      {children}
    </UserContext.Provider>
  );
}
