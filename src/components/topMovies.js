import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './topMovies.css'; 

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
    <div className="top-movies">
      <h3>Top 3 Movies</h3>
      <div className="top-movies-list">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-item"
            onClick={() => navigate(`/reviews/${movie.id}`)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>

      <button className = "showMoreButton"
        onClick={() => navigate("/top-movies")}
      >
        Show More
      </button>
    </div>
  );
};

export default TopMovies;
