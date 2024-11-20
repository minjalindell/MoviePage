import React from 'react';
import { Link } from 'react-router-dom';
import './profile.css'; 

function Profile() {
  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Your Profile</h1>
      </header>
      <nav className="profile-nav">
        <Link to="/search">
          <button className="profile-button">Search movies</button>
        </Link>
        <Link to="/shows">
          <button className="profile-button">Search shows</button>
        </Link>
      </nav>
      {/* Lisää muita profiilikohtia täällä, kuten suosikit, arvostelut, jne. */}
    </div>
  );
}

export default Profile;
