import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './context/userContext.js';
import './userReviewsPage.css';
 
const UserReviewsPage = () => {
  const { user } = useContext(UserContext);  // Käytetään UserContextin tietoja
  const [reviews, setReviews] = useState([]);
  const [movieData, setMovieData] = useState({}); // Tallennetaan elokuvan tiedot ID:n perusteella
  const [loading, setLoading] = useState(true); // Lisää tilan hallinta latausta varten
  const [error, setError] = useState(null); // Virheiden käsittely
 
  useEffect(() => {
    if (!user || !user.user_id) return; // Varmista, että käyttäjä on kirjautunut ja user_id on saatavilla
 
    // Hae käyttäjän arvostelut backendistä
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
        setReviews(data);  // Asetetaan arvostelut tilaan
      } catch (error) {
        setError('Error fetching user reviews');  // Virhetilanteen asettaminen tilaan
        console.error("Error fetching user reviews:", error);
      } finally {
        setLoading(false); // Lataaminen loppui
      }
    };
 
    fetchReviews();
  }, [user]);  // Riippuvuus: vain jos käyttäjä muuttuu
 
  useEffect(() => {
    const fetchMovieDetails = async (movieId) => {
      if (movieData[movieId]) return; // Vältetään uusintahaku, jos tiedot on jo haettu
 
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
 
  // Jos käyttäjä ei ole kirjautunut
  if (!user || !user.user_id) {
    return <p>Please log in to see your reviews.</p>;
  }
 
  // Jos dataa ladataan
  if (loading) {
    return <p>Loading your reviews...</p>;
  }
 
  // Jos tapahtui virhe
  if (error) {
    return <p>{error}</p>;
  }
 
  return (
    <div className="user-reviews-page">
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
    </div>
  );
 
};
 
export default UserReviewsPage;