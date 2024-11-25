import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  
import Login from './components/login';
import Register from './components/register';
import Search from './components/search';
import Profile from './components/profile';
import MovieDetails from './components/MovieDetails';
import Shows from './components/shows';
import TopMovies from './components/topMovies';
import TopMoviesFull from './components/TopMoviesFull';
import ReviewPage from './components/Reviewpage';

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
              {/*top movies komponentti*/}
              <section className='App-top-movies'>
                <TopMovies/>
              </section>
            </div>
          }
        />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<Search/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/top-movies" element={<TopMoviesFull />} />
        <Route path="/reviews/:movieId" element={<ReviewPage />} />
        <Route path="/MovieDetails/:id" element={<MovieDetails />} />


      </Routes>
    </Router>
  );
}

export default App;






