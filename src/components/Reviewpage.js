import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "./context/userContext.js";
import './Reviewpage.css'; // Tuodaan tyylitiedosto

const ReviewPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(UserContext);

  const userEmail = user?.email;

  // Haetaan elokuvan tiedot API:sta
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
      headers: {
        Authorization: "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => setMovie(json))
      .catch((error) => console.log("Error fetching movie details:", error));
  }, [movieId]);

  // Haetaan arvostelut tietokannasta
  useEffect(() => {
    fetch(`/reviews/${movieId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch reviews');
        }
        return res.json();
      })
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
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

    // Lähetetään arvostelu backendille
    fetch('/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit review");
        }
        return res.json();
      })
      .then(() => {
        // Päivitetään arvostelut komponentissa ja tyhjennetään lomake
        setReviews((prevReviews) => [...prevReviews, newReview]);
        setRating(1);
        setReviewText("");
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        alert("There was an error submitting your review. Please try again later.");
      });
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

      {/* Movie details button */}
      <button
        className="movie-details-button"
        onClick={() => navigate(`/movie/${movieId}`)}
      >
        Movie Details
      </button>

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










