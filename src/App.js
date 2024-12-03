import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';  
import Authentication from './components/authentication';
import Search from './components/search';
import Profile from './components/profile';
import MovieDetails from './components/MovieDetails';
import ProtectedRoute from './components/ProtectedRoutes';
import Shows from './components/shows';
import ReviewPage from './components/Reviewpage';
import TopMovies from './components/topMovies';
import TopMoviesFull from './components/TopMoviesFull';
import UserProvider from './components/context/userProvider.js';

function App() {
  return (
    <UserProvider> 
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </UserProvider>
  );
}

function AppRoutes() {
  const [logoutMessage, setLogoutMessage] = useState(""); 
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.fromLogout) {
      setLogoutMessage("You have successfully logged out.");
    } else {
      setLogoutMessage("");
    }
  }, [location]);

  useEffect(() => {
    if (logoutMessage) {
      const timer = setTimeout(() => {
        setLogoutMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [logoutMessage]);

  return (
    <>
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
                <Link to="/authentication" className="nav-link">
                  <button className="nav-button">Log in / Register</button>
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
                <TopMovies />
              </section>
            </div>
          }
        />
        
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/top-movies" element={<TopMoviesFull />} />
        <Route path="/reviews/:movieId" element={<ReviewPage />} />
        <Route path="/MovieDetails/:id" element={<MovieDetails />} />
      </Routes>
    </>
  );
}

export default App;








