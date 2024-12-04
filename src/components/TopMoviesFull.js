import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './TopMoviesFull.css';  
 
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
    <div className="top-movies-container">
      <h2 className="top-movies-title">Top 100 Movies</h2>
      <div className="top-movies-grid">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="top-movie-card"
            onClick={() => navigate(`/reviews/${movie.id}`)}
          >
            <p className="top-movie-index">#{index + 1}</p>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="top-movie-poster"
            />
            <p className="top-movie-title">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default TopMoviesFull;
