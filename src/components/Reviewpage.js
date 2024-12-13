import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserContext } from "./context/userContext.js";
import "./Reviewpage.css";
 
const ReviewPage = () => {
  const { movieId } = useParams();
  const [movieTitle, setMovieTitle] = useState("");
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const { user, signOut } = useContext(UserContext); 
  const userEmail = user.email;

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

  useEffect(() => {
    fetch(`http://localhost:3001/reviews?movie_id=${movieId}`)
      .then((res) => res.json())
      .then((data) =>
        setReviews(
          data.map((review) => ({
            ...review,
            date: review.date || new Date().toISOString(),
          }))
        )
      )
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [movieId]);

  const handleProfileNavigation = () => {
    if (!user || !user.token) {
      alert("You need to be logged in to access the profile page.");
      navigate("/authentication"); 
    } else {
      navigate("/profile"); 
    }
  };
  const handleLogout = () => {
    signOut();
    console.log('Logged out. sessionStorage cleared.');
    navigate("/", { state: { fromLogout: true } });
  };

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

  const [moviePoster, setMoviePoster] = useState(""); 

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMovieTitle(data?.title || "Unknown Movie");
        setMoviePoster(data?.poster_path); 
      })
      .catch((error) => console.error("Error fetching movie details:", error));
  }, [movieId]);

  return (
    <div>

       <header className="review-header">
        <h1>The best movie page</h1>
      </header>

      <nav className="review-nav">
        <Link to="/">
          <button className="review-nav-button">Home</button>
        </Link>
        <Link to="/search">
          <button className="review-nav-button">Search movies</button>
        </Link>
        <Link to="/shows">
          <button className="review-nav-button">Search shows</button>
        </Link>
        <button className="review-nav-button" onClick={handleProfileNavigation}>
          Profile
        </button>

        {user.token ? (
          <button className="review-nav-button" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <Link to="/authentication">
            <button className="review-nav-button">Log in / Register</button>
          </Link>
        )}
      </nav>
      <div className="review-page-container ">
        
      <h1>{movieTitle} - Reviews</h1>
      {moviePoster && (
    <img
      src={`https://image.tmdb.org/t/p/w500${moviePoster}`}
      alt={movieTitle}
      className="review-movie-poster" 
    />
  )}
      <p><button className = "moretitails-button" onClick={() => navigate(`/movie/${movieId}`)}>Movie details</button></p>
      <div className="review-container">
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
        <p>
          <label>Review:</label>
        </p>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  ) : (
    <>
      <p>Please log in to add a review.</p>
      <Link to="/authentication" className="nav-link">
        <button className="review-nav-button">Log in here!</button>
      </Link>
    </>
  )}
</div>
<div className="All-reviews">
  <h3>User Reviews</h3>
  <span style={{ marginLeft: "8px", color: "deeppink"}}>
    (Average: {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)} / 5)
  </span>
  {reviews.length > 0 ? (
    <ul>
      {reviews.map((review) => (
        <li key={review.review_id} className="review-box">
          <div className="review-content">
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
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>No reviews yet.</p>
  )}
</div>
</div>
<footer className="review-footer">
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
 
export default ReviewPage;
 
 