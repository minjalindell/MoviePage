import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./context/userContext";
import "./groups.css";
import { Link, useNavigate } from "react-router-dom";
 
function Groups() {
  const [userGroups, setUserGroups] = useState([]);  // Käyttäjän omat ryhmät
  const [allGroups, setAllGroups] = useState([]);    // Kaikki ryhmät
  const [groupName, setGroupName] = useState("");     // Uuden ryhmän nimi
  const navigate = useNavigate();
  const { user, signOut, } = useContext(UserContext); 


 
  // Haetaan käyttäjän omat ryhmät
  const fetchUserGroups = async () => {
    if (!user.token) {
      return; // Ei haeta käyttäjän omia ryhmiä, jos ei ole kirjautunut
    }
 
    try {
      const response = await axios.get("http://localhost:3001/groups", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setUserGroups(response.data); // Asetetaan omat ryhmät tilaan
    } catch (error) {
      console.error("Error fetching user groups:", error.response?.data || error.message);
    }
  };
 
  // Haetaan kaikki ryhmät (koko tietokannan ryhmät)
  const fetchAllGroups = async () => {
    try {
      const response = await axios.get("http://localhost:3001/groups/all");  // Tämä reitti on lisättävä palvelimelle
      setAllGroups(response.data); // Asetetaan kaikki ryhmät tilaan
    } catch (error) {
      console.error("Error fetching all groups:", error.response?.data || error.message);
    }
  };
 
  useEffect(() => {
    fetchAllGroups(); // Haetaan kaikki ryhmät aina, riippumatta kirjautumisesta
    if (user.token) {
      fetchUserGroups(); // Haetaan käyttäjän omat ryhmät vain, jos käyttäjä on kirjautunut
    }
  }, [user.token]);
 
  const handleCreateGroup = () => {
    if (groupName.trim()) {
      console.log("Creating group with name:", groupName);
      axios
        .post(
          "http://localhost:3001/groups/new",
          { name: groupName, id: user.user_id },
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        )
        .then((response) => {
          console.log("Server response:", response.data);
          setUserGroups([...userGroups, response.data]);
          setGroupName("");
        })
        .catch((error) => {
          console.error("Error creating group:", error.response?.data || error.message);
        });
    } else {
      alert("Please enter a group name.");
    }
  };

  const handleLogout = () => {
    signOut();
    console.log('Logged out. sessionStorage cleared.');
    navigate("/", { state: { fromLogout: true } });
  };
 
  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`); // Navigoi ryhmän sivulle
  };
  const handleProfileNavigation = () => {
    if (!user || !user.token) {
      alert("You need to be logged in to access the profile page.");
      navigate("/authentication");
    } else {
      navigate("/profile");
    }
  };
 
  return (
 <div className="groups-container">

<header className="groups-header">
 <h1>The best movie page</h1>
</header>

<nav className="groups-nav">
 <Link to="/">
   <button className="groups-nav-button">Home</button>
 </Link>
 <Link to="/search">
   <button className="groups-nav-button">Search movies</button>
 </Link>
 <Link to="/shows">
   <button className="groups-nav-button">Search shows</button>
 </Link>
 <button className="groups-nav-button" onClick={handleProfileNavigation}>
   Profile
 </button>
 {user.token ? (
   <button className="groups-nav-button" onClick={handleLogout}>
     Log out
   </button>
 ) : (
   <Link to="/authentication">
     <button className="groups-nav-button">Log in / Register</button>
   </Link>
 )}
</nav>
 
      <div className="groups-wrapper">
        {user.token && (
          <div className="group-list">
            <h2>Your Groups</h2>
            {userGroups.length === 0 ? (
              <p>No groups found.</p>
            ) : (
              <ul>
                {userGroups.map((group) => (
                  <li key={group.group_id}>
                    <button className="group-button" onClick={() => handleGroupClick(group.group_id)}>
                    {group.name}
                    </button>
                    </li>
                ))}
              </ul>
            )}
          </div>
        )}
 

        <div className="group-list">
          <h2>All Groups</h2>
          {allGroups.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            <ul>
              {allGroups.map((group) => (
                <li key={group.group_id}>
                  <button className="group-button" onClick={() => handleGroupClick(group.group_id)}>
                  {group.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {user.token && (
        <div className="input-container">
          <h2>Create New Group</h2>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
          />
          <button className="create-group-button" onClick={handleCreateGroup}>
            Create Group
          </button>
        </div>
      )}
                     <footer className="groups-footer">
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
 
export default Groups;

