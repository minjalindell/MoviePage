import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopMoviesFull = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const pages = [1, 2, 3, 4, 5];
        const moviePromises = pages.map((page) =>
          fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
              "Content-Type": "application/json",
            },
          }).then((response) => response.json())
        );

        const movieData = await Promise.all(moviePromises);

        const allMovies = movieData.flatMap((data) => data.results).slice(0, 100);
        setMovies(allMovies);
      } catch (error) {
        console.error("Error fetching top movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        Top 100 Movies
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            style={{
              textAlign: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              maxWidth: "200px",
              margin: "auto",
              backgroundColor: "#fff",
            }}
            onClick={() => navigate(`/reviews/${movie.id}`)}
          >
            <p
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#555",
                margin: "0 0 10px",
              }}
            >
              #{index + 1}
            </p>
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
    </div>
  );
};

export default TopMoviesFull;