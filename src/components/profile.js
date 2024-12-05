import React, { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import "./profile.css";
import { UserContext } from './context/userContext';

function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useContext(UserContext); 

  const handleLogout = () => {
    signOut();
    console.log('Logged out. sessionStorage cleared.');
    navigate("/", { state: { fromLogout: true } });
  };

  return (
    <div className="Profile">
      <header className="profile-header">
        <h1>The best movie page</h1>
      </header>
      <nav className="Profile-nav">
      <Link to="/">
          <button className="nav-button">Home</button>
        </Link>
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

      <div className="user-info">
        <p><strong>Email:</strong> {user.email || "No email available"}</p>
      </div>

      <div className="profile-buttons-container">
        <button className="profile-button">Favourites</button>
        <button className="profile-button" onClick={() => navigate('/groups')}>Groups</button>
        <button className="profile-button" onClick={() => navigate('/reviews')}>Reviews</button>
      </div>

      <button className="delete-button">Delete</button>
    </div>
  );
}

export default Profile;


