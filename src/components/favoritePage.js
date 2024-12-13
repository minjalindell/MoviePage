import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/userContext";
import "./favoritePage.css"
import { useParams, useNavigate, Link } from "react-router-dom";

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(true); 
   const { user, signOut } = useContext(UserContext); 
    const navigate = useNavigate(); 

  useEffect(() => {
    const fetchFavoritesWithMovieDetails = async () => {
      if (user && user.user_id) {
        try {
          const response = await axios.get(
            `http://localhost:3001/favorites?user_id=${user.user_id}`
          );
          const favoritesData = response.data;

          const favoritesWithDetails = await Promise.all(
            favoritesData.map(async (favorite) => {
              try {
                const tmdbResponse = await fetch(
                  `https://api.themoviedb.org/3/movie/${favorite.movie_id}?language=en-US`,
                  {
                    headers: {
                      Authorization:
                      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
                      "Content-Type": "application/json",
                    },
                  }
                );
                const movieData = await tmdbResponse.json();
                return {
                  ...favorite,
                  movie_title: movieData.title, 
                  release_date: movieData.release_date, 
                  poster_path: movieData.poster_path, 
                };
              } catch (error) {
                console.error(`Error fetching movie details for ID ${favorite.movie_id}:`, error);
                return { ...favorite, movie_title: "Unknown Movie" };
              }
            })
          );

          setFavorites(favoritesWithDetails); 
          setLoading(false);
        } catch (error) {
          console.error("Error fetching favorite movies:", error);
          setLoading(false);
        }
      } else {
        console.error("User not available:", user);
        setLoading(false);
      }
    };

    fetchFavoritesWithMovieDetails();
  }, [user]);

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
    <div>
      <header className="favoritePage-header">
              <h1>The best movie page</h1>
            </header>
      
            <nav className="favoritePage-nav">
              <Link to="/">
                <button className="favoritePage-nav-button">Home</button>
              </Link>
              <Link to="/search">
                <button className="favoritePage-nav-button">Search movies</button>
              </Link>
              <Link to="/shows">
                <button className="favoritePage-nav-button">Search shows</button>
              </Link>
              <button className="favoritePage-nav-button" onClick={handleProfileNavigation}>
                Profile
              </button>
              {user.token ? (
                <button className="favoritePage-nav-button" onClick={handleLogout}>
                  Log out
                </button>
              ) : (
                <Link to="/authentication">
                  <button className="favoritePage-nav-button">Log in / Register</button>
                </Link>
              )}
            </nav>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="favoritePage-list">
          <h2>Your favorites:</h2>
          {favorites.length === 0 ? (
            <p>No favorite movies added yet.</p>
          ) : (
            favorites.map((favorite) => (
              <li key={favorite.favorite_id} className="favoritePage-item">
                <img
                  src={`https://image.tmdb.org/t/p/w200${favorite.poster_path}`}
                  alt={favorite.movie_title}
                />
                <div className="favoritePage-details">
                  <h3>{favorite.movie_title}</h3>
                  <p>Release Date: {favorite.release_date}</p>
                 
                </div>
              </li>
            ))
          )}
        </ul>
      )}
            <footer className="favoritePage-footer">
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

export default FavoritePage;
