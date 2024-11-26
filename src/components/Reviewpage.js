import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Reviewpage.css"; 

const ReviewPage = () => {
  const { movieId } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
      headers: {
        Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error("Error fetching movie details:", error));

    fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US`, {
      headers: {
        Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setReviews(data.results))
      .catch((error) => console.error("Error fetching movie reviews:", error));
  }, [movieId]);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div className="review-page-container">
      <h1
        className="review-page-header"
      >
        {movie.title} - Reviews
      </h1>
      <img
        className="review-page-image"
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <p className="review-page-overview">{movie.overview}</p>
      <button
  className="review-page-button"
  onClick={() => navigate(`/MovieDetails/${movie.id}`)}
>
Click here to see details!
</button>

      <h3 className="review-page-title">User Reviews</h3>
      <div className="review-page-reviews">
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <h4>{review.author}</h4>
                <p>{review.content}</p>
                {review.author_details.rating !== null ? (
                  <p><strong>User Rating:</strong> {review.author_details.rating} / 10</p>
                ) : (
                  <p><strong>User Rating:</strong> Not provided</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-reviews">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;