import { useState, useEffect } from "react";
import { UserContext } from "./userContext.js";
import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export default function UserProvider({ children }) {
  const userFromLocalStorage = localStorage.getItem('user');
  const [user, setUser] = useState(
    userFromLocalStorage ? JSON.parse(userFromLocalStorage) : { email: '', password: '' }
  );

  const signIn = async (email, password) => {
    const json = JSON.stringify({ email, password });
    const headers = { headers: { 'Content-Type': 'application/json' } };
    try {
      const response = await axios.post(url + '/user/login', json, headers);
      const token = response.data.token;
      
      if (token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        console.log(response.data)
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    const json = JSON.stringify({ email, password });
    const headers = { headers: { 'Content-Type': 'application/json' } };
    try {
      await axios.post(url + '/user/register', json, headers);
      setUser({ email: '', password: '' }); // Tyhjennä lomake
    } catch (error) {
      console.error('Error during sign-up:', error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.clear();
    setUser({ email: '', password: '' });
};

  useEffect(() => {
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage));
    }
  }, [userFromLocalStorage]);

  return (
    <UserContext.Provider value={{ user, setUser, signIn, signUp, signOut }}>
      {children}
    </UserContext.Provider>
  );
}
