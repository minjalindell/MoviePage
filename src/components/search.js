import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import './search.css';

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");

  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" },
  ];

  const search = () => {
    let url = `https://api.themoviedb.org/3/${query ? "search/movie" : "discover/movie"}?page=${page}`;
    if (query) url += `&query=${query}`;
    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&primary_release_year=${year}`;

    fetch(url, {
      headers: {
        Authorization: 
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWY5YjZiNmIyY2M4YjQwOTk2YWE1MzY2NmIwMDJkNSIsIm5iZiI6MTczMTY1OTg4NC44OTM1NSwic3ViIjoiNjczNDUzZjgwNTgxNjRjNDA1MjNmYTBkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.xiEsZpA1oJhq910VPdQAqPrZmnktqGJMj58imsF0RtI",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setMovies(json.results || []);
        setPageCount(json.total_pages || 0);
      })
      .catch((error) => console.log(error));
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // Poistetaan tarvittavat tiedot localStorage ja sessionStorage:sta
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    // Navigoidaan etusivulle ja välitetään state-parametreina uloskirjautumisviesti
    navigate("/", { state: { fromLogout: true } });
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/");
    } else {
      search();
    }
  }, [navigate, page]);

  return (
    <div>
      <header className="Profile-header">
        <h1>The best movie page</h1>
      </header>
      <nav className="Profile-nav">
        <Link to="/shows">
          <button className="nav-button">Search shows</button>
        </Link>
        <Link to="/profile">
          <button className="nav-button">Profile</button>
        </Link>
        <button className="nav-button" onClick={handleLogout}>
          Log out
        </button>
      </nav>

      <h3>Search Movies</h3>

      {/* Haku */}
      <div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title"
        />
      </div>

      <div>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">-- Select Genre --</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Search by release year"
        />
      </div>

      <button onClick={search}>Search</button>

      {/* Sivutuksen komponentti */}
      <ReactPaginate
        breakLabel="..."
        nextLabel=" >"
        onPageChange={(e) => setPage(e.selected + 1)}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< "
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="previous"
        nextClassName="next"
        activeClassName="selected"
      />

      {/* Elokuvataulukko */}
      <table>
        {movies.map((movie) => (
          <tr key={movie.id}>
            <td>
              {/* Elokuvan posteri */}
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                  style={{
                    maxWidth: "50px",
                    borderRadius: "4px",
                    marginRight: "10px",
                    verticalAlign: "middle",
                  }}
                />
              )}

              {/* Elokuvan nimi ja navigointipainike */}
              <button
                onClick={() => navigate(`/movie/${movie.id}`)}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {movie.title}
              </button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Search;