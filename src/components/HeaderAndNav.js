import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./context/userContext";
import TopMovies from "./topMovies";

const HeaderAndNav = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <header className="App-header">
        <h1>The best movie page</h1>
      </header>
      <nav className="App-nav">
        {user?.token ? (
          <>
            <Link to="/profile" className="nav-link">
              <button className="nav-button">Profile</button>
            </Link>
          </>
        ) : (
          <Link to="/authentication" className="nav-link">
            <button className="nav-button">Log in / Register</button>
          </Link>
        )}
      </nav>
      <section className="App-section">
        <h2>Check out the selection</h2>
        <div className="section-buttons">
          <Link to="/shows">
            <button className="section-button">Search shows</button>
          </Link>
          <Link to="/search">
            <button className="section-button">Search movies</button>
          </Link>
        </div>
        <TopMovies />
      </section>
    </div>
  );
};

export default HeaderAndNav;
