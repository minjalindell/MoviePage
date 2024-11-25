import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./search.css";

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
        </button>
      </nav>

    </div>
  );
};

export default Search;
