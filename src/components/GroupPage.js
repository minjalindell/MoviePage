import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./GroupPage.css";
import { UserContext } from "./context/userContext";

const GroupPage = () => {
  const { groupId } = useParams(); 
  const { user, signOut } = useContext(UserContext); 
  const navigate = useNavigate(); 
  const [groupInfo, setGroupInfo] = useState(null); 
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [error, setError] = useState(null); 
  const [loadingAction, setLoadingAction] = useState(false); 

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/groups/${groupId}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const data = response.data;
        setGroupInfo(data);

        console.log("Group members:", data.members);
        console.log("Current user ID:", user.id);

        const isUserAdmin = data.admin_id === user.id;
        setIsAdmin(isUserAdmin);
        console.log("User is an admin:", isUserAdmin);

      } catch (error) {
        console.error("Error fetching group info:", error);
        setError("Failed to load group information. Please try again later.");
      }
    };
    fetchGroupInfo();
  }, [groupId, user.token, user.id]);

  // Käsittelee ryhmään liittymisen
  const handleJoinGroup = async () => {
    if (loadingAction) return;
    setLoadingAction(true);
    try {
      const response = await axios.post(
        `http://localhost:3001/groups/${groupId}/join`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updatedGroupInfo = await axios.get(
        `http://localhost:3001/groups/${groupId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setGroupInfo(updatedGroupInfo.data);
    } catch (error) {
      console.error("Error joining group:", error);
      setError("Failed to join the group. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Käsittelee ryhmästä poistumisen
  const handleLeaveGroup = async () => {
    if (loadingAction) return;
    setLoadingAction(true);
    try {
      await axios.delete(
        `http://localhost:3001/groups/${groupId}/leave`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updatedGroupInfo = await axios.get(
        `http://localhost:3001/groups/${groupId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setGroupInfo(updatedGroupInfo.data);
    } catch (error) {
      console.error("Error leaving group:", error);
      setError("Failed to leave the group. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Käsittelee ryhmän poistamisen
  const handleDeleteGroup = async () => {
    if (loadingAction) return;
    setLoadingAction(true);
    try {
      await axios.delete(`http://localhost:3001/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/groups");
    } catch (error) {
      console.error("Error deleting group:", error);
      setError("Failed to delete the group. Please try again.");
    } finally {
      setLoadingAction(false);
    }
  };

  if (!groupInfo && !error) {
    return <p>Loading group information...</p>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

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

  return (
    <div className="group-page-container">
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

      <h1 className="groupPage-Name">  {groupInfo.name}</h1>
      <ul className="members-list">
        <h1>Members:</h1>
        {groupInfo.members?.map((member) => (
          <li key={member.user_id}>
            {member.name} ({member.role})
          </li>
        ))}
      </ul>
      <div className="button-container">
        <button
          className="leave-button"
          onClick={handleLeaveGroup}
          disabled={loadingAction}>
          {loadingAction ? "Leaving..." : "Leave Group"}
        </button>
        {!groupInfo.members?.some((member) => member.user_id === user.id) && (
          <button
            className="join-button"
            onClick={handleJoinGroup}
            disabled={loadingAction}>
            {loadingAction ? "Joining..." : "Join Group"}
          </button>
        )}
        {isAdmin && (
          <button
            className="delete-button"
            onClick={handleDeleteGroup}
            disabled={loadingAction}>
            {loadingAction ? "Deleting..." : "Delete Group"}
          </button>
        )}
      </div>
      <footer className="groupPage-footer">
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

export default GroupPage;
