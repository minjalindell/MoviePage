import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import './search.css';
import { UserContext } from './context/userContext';

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();
  const { user, signOut } = useContext(UserContext);

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

  const handleLogout = () => {
    signOut();
    console.log('Logged out. sessionStorage cleared.');
    navigate("/", { state: { fromLogout: true } });
  };

  const handleProfileNavigation = () => {
    if (!user || !user.token) {
      alert("You need to be logged in to access the profile page.");
      navigate("/authentication");
    } else {
      navigate("/profile");
    }
  };
  useEffect(() => {
    search(); 
  }, [page, query, genre, year]);

  return (
    <div>
      <header className="search-header">
        <h1>The best movie page</h1>
      </header>

      <nav className="search-nav">
        <Link to="/">
          <button className="search-nav-button">Home</button>
        </Link>
        <Link to="/shows">
          <button className="search-nav-button">Search shows</button>
        </Link>
        <button className="search-nav-button" onClick={handleProfileNavigation}>
          Profile
        </button>
        {user.token ? (
          <button className="search-nav-button" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <Link to="/authentication">
            <button className="search-nav-button">Log in / Register</button>
          </Link>
        )}
      </nav>

      <div className="search-filter-box">
        <h3>Search Movies</h3>
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

        <button className="search-button" onClick={search}>Search</button>
      </div>

      <div className="pagination">
        <ReactPaginate
          breakLabel="..." 
          nextLabel=">"
          onPageChange={(e) => setPage(e.selected + 1)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={0}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="previous"
          nextClassName="next"
          activeClassName="selected"
          breakClassName="break-item"
          breakLinkClassName="break-link"
        />
      </div>

      <div className="search-movies-list">

        {movies.map((movie) => (
          <div
            key={movie.id}
            className="search-movie-item"
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


      <footer className="search-footer">
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
 
export default Search;
