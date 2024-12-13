import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams} from "react-router-dom";
import { UserContext } from "./context/userContext.js";
import "./MovieDetails.css";
import axios from "axios";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const navigate = useNavigate();
  const { user, signOut } = useContext(UserContext);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {

        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",

        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => setMovie(json))
      .catch((error) => console.log(error));
  }, [id]);
 
  if (!movie) {
    return <p>Loading...</p>;
  }

  const handleLogout = () => {
    signOut();
    console.log("Logged out. sessionStorage cleared.");
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
  const addToFavorites = async () => {
    if (!user || !user.user_id || !movie || !movie.id) {
      alert("You must be logged in to add favorites.");
      console.error("Missing user or movie data");
      return;  
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/favorites`,
        {
          user_id: user.user_id,  
          movie_id: movie.id, 
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,  
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        alert("Added to favorite list.");
        console.log("Movie added to favorites:", response.data);
      }
    } catch (error) {
      console.error("Error adding movie to favorites:", error.response ? error.response.data : error.message);
      alert("Failed to add movie to favorites.");
    }
  };

  return (
    <div className="movie-details-container">
      {/* Header ja Nav */}
      <header className="movie-details-header">
        <h1>The best movie page</h1>
      </header>

      <nav className="movie-details-nav">
        <Link to="/">
          <button className="movie-details-nav-button">Home</button>
        </Link>
        <Link to="/search">
          <button className="movie-details-nav-button">Search movies</button>
        </Link>
        <Link to="/shows">
          <button className="movie-details-nav-button">Search shows</button>
        </Link>
        <button className="movie-details-nav-button" onClick={handleProfileNavigation}>
          Profile
        </button>
        {user.token ? (
          <button className="movie-details-nav-button" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <Link to="/authentication">
            <button className="movie-details-nav-button">Log in / Register</button>
          </Link>
        )}
      </nav>

      <div className="movie-details-content">
        <h2>{movie.title}</h2>

        <div className="movie-details-images">
  <img
    className="small-img"
    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
    alt={movie.title}
  />
  {movie.backdrop_path && (
    <img
      className="large-img"
      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
      alt={`${movie.title} Backdrop`}
    />
  )}
</div>

<div className="movie-details">

        <p>{movie.overview}</p>

        <p><strong>Original Title:</strong> {movie.original_title}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
        <p><strong>Language:</strong> {movie.spoken_languages.map(lang => lang.english_name).join(", ")}</p>
        <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(", ")}</p>
        <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
        <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
        <p><strong>Popularity:</strong> {movie.popularity}</p>
        </div>

        <div className="movie-production-companies">
        <p><strong>Production Companies:</strong></p>
<ul>
{movie.production_companies.map(company => (
            <li key={company.id}>
              {company.logo_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                  alt={company.name}
                  style={{ maxWidth: "100px", verticalAlign: "middle", marginRight: "10px" }}
                />
              )}
              {company.name} ({company.origin_country})
            </li>
          ))}
</ul>
</div>
<div className="moviedetails-buttons-container">
  <button onClick={addToFavorites} className="moviedetails-review-button">
    Add to Favorites
  </button>
  <button
    onClick={() => navigate(`/reviews/${id}`)}
    className="moviedetails-review-button"
  >
    Reviews
  </button>
</div>
</div>
    <footer className="moviedetails-footer">
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
 
export default MovieDetails;
