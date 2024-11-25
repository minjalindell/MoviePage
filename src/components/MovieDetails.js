import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: 
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => setMovie(json))
      .catch((error) => console.log(error));
  }, [id]);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Elokuvan nimi */}
      <h2>{movie.title}</h2>

      {/* Posteri ja taustakuva */}
      <div style={{ display: "flex", gap: "20px" }}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          style={{ maxWidth: "200px", borderRadius: "8px" }}
        />
        {movie.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            alt={`${movie.title} Backdrop`}
            style={{ maxWidth: "400px", borderRadius: "8px" }}
          />
        )}
      </div>

      {/* Kuvaus */}
      <p style={{ marginTop: "20px" }}>{movie.overview}</p>

      {/* Lisätiedot */}
      <div>
        <h4>Details</h4>
        <p><strong>Original Title:</strong> {movie.original_title}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
        <p><strong>Language:</strong> {movie.spoken_languages.map(lang => lang.english_name).join(", ")}</p>
        <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(", ")}</p>
        <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
        <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString()}</p>
        <p><strong>Popularity:</strong> {movie.popularity}</p>
        <p><strong>Average Vote:</strong> {movie.vote_average} ({movie.vote_count} votes)</p>
        <p><strong>Average Rating:</strong> {movie.vote_average} / 10</p>
        <p><strong>Total Votes:</strong> {movie.vote_count}</p>
      </div>

      {/* Tuotantoyhtiöt */}
      <div>
        <h4>Production Companies</h4>
        <ul>
          {movie.production_companies.map(company => (
            <li key={company.id}>
              {company.logo_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                  alt={company.name}
                  style={{ maxWidth: "100px", verticalAlign: "middle", marginRight: "10px" }}
                />
              )}
              {company.name} ({company.origin_country})
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => navigate(`/reviews/${id}`)} 
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Reviews
      </button>
    </div>
  );
};

export default MovieDetails;