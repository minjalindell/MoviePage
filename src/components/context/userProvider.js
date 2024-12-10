import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./userContext.js";

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

  const deleteAccount = async (userId, email) => {
    try {
      const response = await axios.delete(`${url}/user/delete`, {
        data: { user_id: userId, email: email },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Account deleted:', response.data);
    } catch (error) {
      console.error('Account deletion failed:', error);
      throw error;
    }
  };
  
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, signIn, signUp, signOut, deleteAccount }}>
      {children}
    </UserContext.Provider>
  );
}