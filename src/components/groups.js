import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./groups.css";
import { UserContext } from "./context/userContext";
 
function Groups() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState(null); 
  const { user } = useContext(UserContext);
  const { userId } = user?.user_id;

  const getToken = () => {
    const token = sessionStorage.getItem("user");
    if (token) {
      return JSON.parse(token).token;
    }
    return null;
  };
 
  // näytä kaikki ryhmät
  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.error("Token missing, unable to fetch groups.");
      return;
    }

    axios
      .get("http://localhost:3001/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  }, []);
 
  // uuden ryhmän luominen
  const handleCreateGroup = () => {
    const token = getToken();
    if (!token) {
      console.error("Token missing, unable to create group.");
      return;
    }

    if (groupName.trim()) {
      console.log('Creating group with name:', groupName);
      axios
      .post("http://localhost:3001/groups/new",
         { name: groupName },
        { headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
        .then((response) => {
          console.log('Server response:', response.data);
          setGroups((prevGroups) => [...prevGroups, response.data]);
          setGroupName("");
        })
        .catch((error) => {
          console.error("Error creating group:", error.response?.data || error.message);
          setError("Failed to create group. Please try again later.");
        });
    } else {
      alert("Please enter a group name.");
    }
  };
 
  return (
    <div className="groups-container">
      <h1>Groups</h1>

      {error && <p className="error-message">{error}</p>} {/* Näytetään virheilmoitus */}
 
      <div className="groups-wrapper">
        {/* Käyttäjän omat ryhmät */}
        <div className="group-list">
          <h2>Your Groups</h2>
          {groups.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            <ul>
              {groups.map((group) => (
                <li key={group.group_id}>{group.name}</li>
              ))}
            </ul>
          )}
        </div>
 
        {/* Kaikki ryhmät */}
        <div className="group-list">
          <h2>All Groups</h2>
          {groups.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            <ul>
              {groups.map((group) => (
                <li key={group.group_id}>{group.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
 
      {/* Uuden ryhmän luominen */}
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
    </div>
  );
}
 
export default Groups;