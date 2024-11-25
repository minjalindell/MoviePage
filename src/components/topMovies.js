

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopMovies = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", {
      headers: {
        Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results.slice(0, 3)); 
      })
      .catch((error) => console.error("Error fetching top movies:", error));
  }, []);

  return (
    <div className="top-movies" style={{ padding: "20px", textAlign: "center" }}>
      <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#000", marginBottom: "20px" }}>
        Top 3 Movies
      </h3>
      <div className="top-movies-list" style={{ display: "flex", justifyContent: "center" }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-item"
            onClick={() => navigate(`/movie/${movie.id}`)}
            style={{
              cursor: "pointer",
              margin: "15px",
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              maxWidth: "200px",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              style={{
                borderRadius: "4px",
                width: "100%",
                marginBottom: "10px", 
              }}
            />
            <p
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                margin: "0",
              }}
            >
              {movie.title}
            </p>
          </div>
        ))}
      </div>

      {/* "Show More" Button */}
      <button
        onClick={() => navigate("/top-movies")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Show More
      </button>
    </div>
  );
};

export default TopMovies;