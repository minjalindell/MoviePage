import React, { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom"; 
import "./profile.css";
import { UserContext } from './context/userContext';

function Profile() {
  const navigate = useNavigate();
  const { user, signOut, deleteAccount } = useContext(UserContext); 

  const handleLogout = () => {
    signOut();
    console.log('Logged out. sessionStorage cleared.');
    navigate("/", { state: { fromLogout: true } });
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      if (!user.user_id || !user.email) {
        console.error('User details are missing:', user);
        alert('User ID or Email is not available');
        return;
      }
  
      try {
        await deleteAccount(user.user_id, user.email);
        alert('Your account has been deleted.');
        signOut();
        navigate("/");
      } catch (error) {
        alert('Failed to delete account');
        console.error('Delete account error:', error);
      }
    }
  };
  
  
  
  return (
    <div className="profile">
      <header className="profile-header">
        <h1>The best movie page</h1>
      </header>
      <nav className="profile-nav">
        <Link to="/">
          <button className="profile-nav-button">Home</button>
        </Link>
        <Link to="/search">
          <button className="profile-nav-button">Search movies</button>
        </Link>
        <Link to="/shows">
          <button className="profile-nav-button">Search shows</button>
        </Link>
        <button className="profile-nav-button" onClick={handleLogout}>
          Log out
        </button>
      </nav>

      <h1>Your Profile</h1>

      <div className="user-info">
        <p><strong>Email:</strong> {user.email || "No email available"}</p>
      </div>

      <div className="profile-buttons-container">
        <button className="profile-button" onClick={() => navigate('/favorites')}>Favorites</button>
        <button className="profile-button" onClick={() => navigate('/groups')}>Groups</button>
        <button className="profile-button" onClick={() => navigate('/user-reviews')}>Reviews</button>
    

      <button className="profile-button" onClick={handleDelete}>Delete Account</button>
      </div>
 
<footer className="profile-footer">
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
}
 
export default Profile;
 