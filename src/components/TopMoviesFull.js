import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from './context/userContext'; 
import './TopMoviesFull.css';  

const TopMoviesFull = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const { user, signOut } = useContext(UserContext);  

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const pages = [1, 2, 3, 4, 5];
        const moviePromises = pages.map((page) =>
          fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
              "Content-Type": "application/json",
            },
          }).then((response) => response.json())
        );

        const movieData = await Promise.all(moviePromises);
        const allMovies = movieData.flatMap((data) => data.results).slice(0, 100);
        setMovies(allMovies);
      } catch (error) {
        console.error("Error fetching top movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleLogout = () => {
    signOut();
    console.log('Logged out. sessionStorage cleared.');
    navigate("/", { state: { fromLogout: true } });
  };
  
  const handleProfileNavigation = () => {
    if (!user || !user.token) {
      alert("You need to be logged in to access the profile page.");
      navigate("/authentication"); 
    } else {
      navigate("/profile"); 
    }
  };

  return (
    <div className="top-movies-container">
      <header className="top-movies-header">
        <h1>The best movie page</h1>
      </header>

      <nav className="top-movies-nav">
        <Link to="/">
          <button className="top-movies-nav-button">Home</button>
        </Link>
        <Link to="/search">
          <button className="top-movies-nav-button">Search movies</button>
        </Link>
        <Link to="/shows">
          <button className="top-movies-nav-button">Search shows</button>
        </Link>
        <button className="top-movies-nav-button" onClick={handleProfileNavigation}>
          Profile
        </button>
        {user.token ? (
          <button className="top-movies-nav-button" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <Link to="/authentication">
            <button className="top-movies-nav-button">Log in / Register</button>
          </Link>
        )}
      </nav>

      <h2 className="top-movies-title">Top 100 Movies</h2>
      <div className="top-movies-grid">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="top-movie-card"
            onClick={() => navigate(`/reviews/${movie.id}`)}
          >
            <p className="top-movie-index">#{index + 1}</p>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="top-movie-poster"
            />
            <p className="top-movie-title">{movie.title}</p>
          </div>
        ))}
      
      </div>
      <footer className="TopMovies-footer">
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
  );

};

export default TopMoviesFull;
