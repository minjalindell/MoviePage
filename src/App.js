import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  
import Login from './components/login';
import Register from './components/register';
import Search from './components/search';

function App() {
  return (
    <Router>
      <Routes>
        {/* Pääsivu */}
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <h1>The best movie page</h1>
              </header>
              <nav className="App-nav">
                <Link to="/login" className="nav-link">
                  <button className="nav-button">Log in</button>
                </Link>
                <Link to="/register" className="nav-link">
                  <button className="nav-button">Register</button>
                </Link>
              </nav>
              <section className="App-section">
                <h2>Check out the selection</h2>
                <Link to="/shows">
                  <button className="section-button">Search shows</button>
                </Link>
                <Link to="/search">
                  <button className="section-button">Search movies</button>
                </Link>
              </section>
            </div>
          }
        />


        <Route path="/login" element={<Login />} />


        <Route path="/register" element={<Register />} />

        <Route path="/search" element={<Search/>} />

      </Routes>
    </Router>
  );
}

export default App;






