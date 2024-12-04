import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./context/userContext.js";

const ReviewPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(UserContext);

  const userEmail = user?.email;

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
      headers: {
        Authorization: "Bearer YOUR-TMDB-API-KEY",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => setMovie(json))
      .catch((error) => console.log("Error fetching movie details:", error));
  }, [movieId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert("Please log in to submit a review.");
      return;
    }

  
    const newReview = {
      user_email: userEmail,
      movie_id: movieId,
      movie_title: movie?.title,
      rating,
      review_text: reviewText,
    };

    // Lisää arvostelu komponentin tilaan (local state!!!!)
    setReviews((prevReviews) => [...prevReviews, newReview]);
    setRating(1);
    setReviewText("");
  };

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>{movie.title}</h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          style={{ maxWidth: "300px", borderRadius: "8px" }}
        />
      </div>

      <h3>Add a Review</h3>
      {userEmail ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Rating (1-5):</label>
            <input
              type="number"
              value={rating}
              min="1"
              max="5"
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>
          <div>
            <label>Review:</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Please log in to add a review.</p>
      )}

      <h3>User Reviews</h3>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>
              <p><strong>{review.user_email}</strong> ({review.rating}/5):</p>
              <p>{review.review_text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewPage;







