


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ReviewPage = () => {
  const { movieId } = useParams(); 
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch movie details
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

    // Fetch reviews
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
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <h1>{movie.title} - Reviews</h1>
      <button
        onClick={() => navigate(`/MovieDetails/${movie.id}`)}
        style={{
          padding: "5px 10px",
          fontSize: "14px",
          cursor: "pointer",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Details
      </button>
    </div>
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
      style={{ maxWidth: "200px", marginBottom: "20px" }}
    />

    <p>{movie.overview}</p>

    <h3>User Reviews</h3>
    {reviews.length > 0 ? (
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <h4>{review.author}</h4>
            <p>{review.content}</p>
            {review.author_details.rating !== null ? (
              <p>
                <strong>User Rating:</strong> {review.author_details.rating} / 10
              </p>
            ) : (
              <p>
                <strong>User Rating:</strong> Not provided
              </p>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p>No reviews yet</p>
    )}
  </div>
);
}
export default ReviewPage;