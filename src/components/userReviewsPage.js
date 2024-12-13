import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './context/userContext.js';
import { useNavigate, Link} from "react-router-dom";
import './userReviewsPage.css';
 
 
const UserReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [movieData, setMovieData] = useState({}); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const { user, signOut } = useContext(UserContext);  
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!user || !user.user_id) return; 
  
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/user/user-reviews?user_id=${user.user_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
 
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
 
        const data = await response.json();
        setReviews(data);  
      } catch (error) {
        setError('Error fetching user reviews'); 
        console.error("Error fetching user reviews:", error);
      } finally {
        setLoading(false); 
      }
    };
 
    fetchReviews();
  }, [user]); 

  useEffect(() => {
    const fetchMovieDetails = async (movieId) => {
      if (movieData[movieId]) return; 
 
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",  // Lisää oma TMDb API-avaimesi
              "Content-Type": "application/json",
            },
          }
        );
 
        if (!response.ok) {
          throw new Error(`Failed to fetch details for movie ID ${movieId}`);
        }
 
        const data = await response.json();
        setMovieData((prev) => ({
          ...prev,
          [movieId]: { title: data.title, poster: data.poster_path },
        }));
      } catch (error) {
        console.error(`Error fetching movie details for movie ID ${movieId}:`, error);
      }
    };
 
    reviews.forEach((review) => {
      if (review.movie_id && !movieData[review.movie_id]) {
        fetchMovieDetails(review.movie_id);
      }
    });
  }, [reviews, movieData]);
 
  
  if (!user || !user.user_id) {
    return <p>Please log in to see your reviews.</p>;
  }
 
  if (loading) {
    return <p>Loading your reviews...</p>;
  }
 
  if (error) {
    return <p>{error}</p>;
  }
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
    <div className="user-reviews">
      <header className="userReviewsPage-header">
        <h1>The best movie page</h1>
      </header>

      <nav className="userReviewsPage-nav">
        <Link to="/">
          <button className="userReviewsPage-nav-button">Home</button>
        </Link>
        <Link to="/search">
          <button className="userReviewsPage-nav-button">Search movies</button>
        </Link>
        <Link to="/shows">
          <button className="userReviewsPage-nav-button">Search shows</button>
        </Link>
        <button className="userReviewsPage-nav-button" onClick={handleProfileNavigation}>
          Profile
        </button>
        {user.token ? (
          <button className="userReviewsPage-nav-button" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <Link to="/authentication">
            <button className="userReviewsPage-nav-button">Log in / Register</button>
          </Link>
        )}
      </nav>
      <h1>Your Reviews</h1>
      {reviews.length > 0 ? (
        <ul className="reviews-list">
          {reviews.map((review) => {
            const movie = movieData[review.movie_id] || {};
            return (
              <li key={review.review_id} className="review-item">
                {movie.poster && (
                  <div className="movie-poster-container">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                      alt={movie.title || "Movie poster"}
                    />
                  </div>
                )}
                <div className="review-details">
                  <h3 className="movie-title">{movie.title || "Loading movie title..."}</h3>
                  <p className="review-text"><strong>Your review:</strong> {review.review_text}</p>
                  <p className="review-rating"><strong>Rating:</strong> {review.rating}/5</p>
                  <p className="review-date"><strong>Reviewed on:</strong> {new Date(review.review_date).toLocaleDateString()}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-reviews-message">No reviews found.</p>
      )}
      <footer className="userReviewsPage-footer">
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
 
export default UserReviewsPage;