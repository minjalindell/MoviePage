import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';  
import Login from './components/login';
import Register from './components/register';
import Search from './components/search';
import Profile from './components/profile';
import MovieDetails from './components/MovieDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Shows from './components/shows';

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

function AppRoutes() {
  const [logoutMessage, setLogoutMessage] = useState(""); // Viesti uloskirjautumisesta
  const location = useLocation(); // Käytetään vain Routerin sisällä

  // Käytämme useEffectiä, joka tarkistaa, onko käyttäjä kirjautunut ulos
  useEffect(() => {
    if (location.state && location.state.fromLogout) {
      setLogoutMessage("You have successfully logged out.");
    } else {
      setLogoutMessage(""); // Jos ei ole uloskirjautunut, tyhjennetään viesti
    }
  }, [location]);

  // Viestin poistaminen automaattisesti 5 sekunnin kuluttua
  useEffect(() => {
    if (logoutMessage) {
      const timer = setTimeout(() => {
        setLogoutMessage(""); // Tyhjennetään viesti
      }, 5000);
      return () => clearTimeout(timer); // Puhdistetaan timer
    }
  }, [logoutMessage]);

  return (
    <>
      {/* Näytetään uloskirjautumisviesti */}
      {logoutMessage && <div className="logout-message">{logoutMessage}</div>}

      <Routes>
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
                <div className="section-buttons">
                  <Link to="/shows">
                    <button className="section-button">Search shows</button>
                  </Link>
                  <Link to="/search">
                    <button className="section-button">Search movies</button>
                  </Link>
                </div>
              </section>
            </div>
          }
        />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/shows" element={<Shows />} />
      </Routes>
    </>
  );
}

export default App;
