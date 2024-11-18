import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';  
import Login from './components/login'; 

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>The best movie page</h1>
          
         
          <Link to="/login">
            <button className="login-button">Go to Login</button>
          </Link>
        </header>

       
        <Routes>
          <Route path="/" element={<h2>Welcome to the Home Page</h2>} /> 
          <Route path="/login" element={<Login />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;


