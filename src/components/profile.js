import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./profile.css";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Poistetaan tarvittavat tiedot localStorage ja sessionStorage:sta
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    // Navigoidaan etusivulle ja välitetään state-parametreina viesti
    navigate("/", { state: { fromLogout: true } });
  };

  return (
    <div className="Profile">
      <header className="Profile-header">
        <h1>The best movie page</h1>
      </header>
      <nav className="Profile-nav">
        <Link to="/search">
          <button className="nav-button">Search movies</button>
        </Link>
        <Link to="/shows">
          <button className="nav-button">Search shows</button>
        </Link>
        <button className="nav-button" onClick={handleLogout}>
          Log out
        </button>
      </nav>

      <h1>Your Profile</h1>

      <div className="profile-buttons-container">
        <button className="profile-button">Favourites</button>
        <button className="profile-button">Groups</button>
        <button className="profile-button">Reviews</button>
      </div>

      <button className="delete-button">Delete</button>
    </div>
  );
}

export default Profile;
