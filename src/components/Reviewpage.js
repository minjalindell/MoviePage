import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "./context/userContext.js";
import "./Reviewpage.css";

const ReviewPage = () => {
  const { movieId } = useParams();
  const [movieTitle, setMovieTitle] = useState("");
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const userEmail = user.email;

  // Haetaan elokuvan tiedot
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setMovieTitle(data?.title || "Unknown Movie"))
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [movieId]);

  // Haetaan arvostelut
  useEffect(() => {
    fetch(`http://localhost:3001/reviews`)
      .then((res) => res.json())
      .then((data) =>
        setReviews(
          data
            .filter((review) => review.movie_id === parseInt(movieId))
            .map((review) => ({
              ...review,
              date: review.date || new Date().toISOString(),
            }))
        )
      )
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [movieId]);

  // Lähetetään arvostelu
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
      email: userEmail,
      timestamp: new Date().toISOString(),
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
        setReviews((prev) => [
          ...prev,
          { ...data.review, date: data.review.date || new Date().toISOString() },
        ]);
        setRating(1);
        setReviewText("");
      })
      .catch((error) => {
        console.error("Error adding review:", error);
        alert("Failed to add the review. Please try again later.");
      });
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  return (
    <div>
      <h1>{movieTitle} - Reviews</h1>
      <button
                onClick={() => navigate(`/movie/${movieId}`)}
              >Movie details</button>
      <h3>Add a Review</h3>
      {userEmail ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rating >= star ? "filled" : ""}`}
                  onClick={() => handleRatingChange(star)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
          <div>
            <p><label>Review:</label></p>
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
              <p><strong>{review.email}</strong>:</p>
              <div className="star-rating-review">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star-rewiev ${review.rating >= star ? "star-filled-rewiev" : ""}`}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <p>{review.review_text}</p>
              <p><small>Reviewed on: {new Date(review.review_date).toLocaleDateString()}</small></p>
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
