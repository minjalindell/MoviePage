import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from './components/context/userContext';
import Authentication from './components/authentication';
import Search from './components/search';
import Profile from './components/profile';
import MovieDetails from './components/MovieDetails';
import Shows from './components/shows';
import ReviewPage from './components/Reviewpage';
import TopMovies from './components/topMovies';
import TopMoviesFull from './components/TopMoviesFull';
import UserProvider from './components/context/userProvider';
import Groups from './components/groups';
import GroupPage from './components/GroupPage.js';
import UserReviewsPage from './components/userReviewsPage';
import './App.css'
import FavoritePage from './components/favoritePage';

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
  const { user } = useContext(UserContext);
  const [logoutMessage, setLogoutMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (location.state?.fromLogout) {
      setLogoutMessage("You have successfully logged out.");
      const newLocation = { ...location, state: {} };
      navigate(newLocation, { replace: true });
    }
  }, [location, navigate]);
 
  useEffect(() => {
    if (logoutMessage) {
      const timer = setTimeout(() => {
        setLogoutMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [logoutMessage]);
 
  const ProtectedRoute = ({ element }) => {
    if (!user.token) {
      return navigate("/authentication", { replace: true });
    }
    return element;
  };
 
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
                {user.token ? (
                  <>
                    <Link to="/profile" className="nav-link">
                      <button className="App-nav-button">Profile</button>
                    </Link>
                  </>
                ) : (
                  <Link to="/authentication" className="nav-link">
                    <button className="App-nav-button">Log in / Register</button>
                  </Link>
                )}
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
                <section className="App-section-groups">
                <h2>Browse Groups</h2>
                <Link to="/groups">
                  <button className="section-button">Browse Groups</button>
                </Link>
              </section>
                <TopMovies />
              </section>
              

<footer className="App-footer">
  <p>© Copyright 2024</p>
  <p>
    Usage of{' '}
    <a href="https://www.finnkino.fi/xml/" target="_blank" rel="noopener noreferrer">
      Finnkino API
    </a>{' '}
    and{' '}
    <a href="https://developer.themoviedb.org/reference/intro/getting-started" target="_blank" rel="noopener noreferrer">
      Moviedatabase API
    </a>
  </p>
</footer>
</div>
          }
        />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/top-movies" element={<TopMoviesFull />} />
        <Route path="/reviews/:movieId" element={<ReviewPage />} />
        <Route path="/MovieDetails/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<ProtectedRoute element={<FavoritePage />} />} />
        <Route path="/movie/:movieId" component={FavoritePage} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId" element={<ProtectedRoute element={<GroupPage />} />} />
        <Route path="/user-reviews" element={<UserReviewsPage />} />

      </Routes>
    </>
  );
}
 
export default App;
