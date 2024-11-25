import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useNavigate, Link } from "react-router-dom";
import "./search.css";
=======
import { useNavigate } from "react-router-dom";
import './search.css';

>>>>>>> 1c77d9d917b799b283386a62dcca73e4fb42ad49

const Search = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    // Poista token tai muut tiedot localStoragesta tai sessionStoragesta
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    // Uudelleenohjaa kirjautumissivulle ja lähetä uloskirjautumisviesti
    navigate("/", { state: { fromLogout: true } });
  };

  return (
<<<<<<< HEAD
    <div>
      <header className="Search-header">
        <h1>The best movie page</h1>
      </header>
      <nav className="Search-nav">
        <Link to="/shows">
          <button className="nav-button">Search shows</button>
        </Link>
        <Link to="/profile">
          <button className="nav-button">Profile</button>
        </Link>
        <button className="profile-button" onClick={handleLogout}>
          Log out
=======
    <div id="container">
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
        <button onClick={() => navigate(`/movie/${movie.id}`)} style={{ background: "none", border: "none", color: "blue", textDecoration: "underline", cursor: "pointer" }}>
          {movie.title}
>>>>>>> 1c77d9d917b799b283386a62dcca73e4fb42ad49
        </button>
      </nav>

    </div>
  );
};

export default Search;
