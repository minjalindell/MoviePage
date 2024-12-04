import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "./context/userContext.js";

const ReviewPage = () => {
  const { movieId } = useParams(); 
  const [movieTitle, setMovieTitle] = useState(""); 
  const [rating, setRating] = useState(1); 
  const [reviewText, setReviewText] = useState(""); 
  const [reviews, setReviews] = useState([]);

  // Kyttäjätietojen hakeminen
  const { user } = useContext(UserContext);
  const userEmail = user?.email; 


  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
      headers: {
        Authorization: "Bearer <YOUR-TMDB-API-KEY>",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setMovieTitle(data.title))
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [movieId]);

  // Arvostelut tietokannasta
  useEffect(() => {
    fetch(`http://localhost:3001/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data.filter((review) => review.movie_id === parseInt(movieId))))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [movieId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert("Please log in to submit a review.");
      return;
    }

    const reviewData = {
      user_id: user.user_id, 
      movie_id: movieId,
      movie_title: movieTitle,
      rating,
      review_text: reviewText,
      user_email: userEmail,
    };

    fetch("http://localhost:3001/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Review added:", data);
        setReviews((prev) => [...prev, data.review]);
        setRating(1); 
        setReviewText("");
      })
      .catch((error) => console.error("Error adding review:", error));
  };

  return (
    <div>
      <h1>{movieTitle} - Reviews</h1>

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
              onChange={(e) => setRating(e.target.value)}
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
          {reviews.map((review) => (
            <li key={review.review_id}>
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




