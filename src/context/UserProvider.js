import { useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

const url = process.env.REACT_APP_API_URL;


export default function UserProvider({ children }) {
  const userFromSessionStorage = sessionStorage.getItem('user');
  const [user, setUser] = useState(userFromSessionStorage ? JSON.parse(userFromSessionStorage) : { email: '', password: '' });

  const signUp = async () => {
    const json = JSON.stringify(user);
    const headers = { headers: { 'Content-Type': 'application/json' } };
    try {
      // Varmista, että käytät ympäristömuuttujaa oikeassa muodossa
      const response = await axios.post(url + `/register`, json, headers);
      setUser({ email: '', password: '' });
    } catch (error) {
      console.error(error.response ? error.response.data : error);
      throw error;
    }
  };
  

  const signIn = async () => {
    const json = JSON.stringify(user);
    const headers = { headers: { 'Content-Type': 'application/json' } };
    try {
      const response = await axios.post(url + '/login', json, headers);
      const token = response.data.token;
      setUser(response.data);
      sessionStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error(error.response ? error.response.data : error);
      setUser({ email: '', password: '' });
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, signUp, signIn }}>
      {children}
    </UserContext.Provider>
  );
}